'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FieldErrors, SavedAddress, ShippingOption } from '@/components/checkout/checkout-utils'
import { validateCheckoutForm } from './checkout-validators'
import { emptyCheckoutFormData, type CheckoutFormData } from './checkout-types'

export interface CheckoutFormController {
  formData: CheckoutFormData
  errors: FieldErrors
  savedAddresses: SavedAddress[]
  selectedAddressId: string | ''
  shippingOptions: ShippingOption[]
  selectedShipping: string
  lgpdConsent: boolean
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>
  setLgpdConsent: (value: boolean) => void
  setSelectedShipping: (value: string) => void
  updateField: (field: string, value: string) => void
  selectAddress: (id: string) => void
  clearSelectedAddress: () => void
  validateForm: () => boolean
}

export function useCheckoutForm(itemsLength: number, totalPrice: number): CheckoutFormController {
  const [formData, setFormData] = useState<CheckoutFormData>(emptyCheckoutFormData)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | ''>('')
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState('')
  const [lgpdConsent, setLgpdConsent] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const [res, addrRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/cliente/endereco'),
        ])
        const [{ customer }, { addresses }] = await Promise.all([res.json(), addrRes.json()])
        if (customer) {
          setFormData((prev) => ({
            ...prev,
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
          }))
        }
        if (addresses?.length) {
          setSavedAddresses(addresses)
          const defaultAddr = addresses.find((a: SavedAddress) => a.isDefault) || addresses[0]
          setSelectedAddressId(defaultAddr.id)
          setFormData((prev) => ({
            ...prev,
            cep: defaultAddr.cep || '',
            street: defaultAddr.street || '',
            number: defaultAddr.number || '',
            neighborhood: defaultAddr.neighborhood || '',
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
          }))
        }
      } catch {}
    })()
  }, [])

  const shippingFetchedRef = useRef('')

  useEffect(() => {
    if (formData.state.length !== 2 || itemsLength === 0) return
    const key = `${formData.state}:${itemsLength}:${totalPrice}`
    if (shippingFetchedRef.current === key) return
    shippingFetchedRef.current = key
    const controller = new AbortController()
    fetch('/api/shipping', {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: formData.state, items: itemsLength, subtotal: totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.options) {
          setShippingOptions(data.options)
          setSelectedShipping((prev) => prev || data.options[0]?.service || '')
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [formData.state, itemsLength, totalPrice])

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function selectAddress(id: string) {
    const addr = savedAddresses.find((a) => a.id === id)
    if (!addr) return
    setSelectedAddressId(id)
    setFormData((prev) => ({
      ...prev,
      cep: addr.cep,
      street: addr.street,
      number: addr.number,
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
    }))
  }

  function clearSelectedAddress() {
    setSelectedAddressId('')
    setFormData((prev) => ({
      ...prev,
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
    }))
  }

  const validateForm = useCallback((): boolean => {
    const newErrors = validateCheckoutForm(formData, lgpdConsent)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, lgpdConsent])

  return {
    formData,
    errors,
    savedAddresses,
    selectedAddressId,
    shippingOptions,
    selectedShipping,
    lgpdConsent,
    setErrors,
    setLgpdConsent,
    setSelectedShipping,
    updateField,
    selectAddress,
    clearSelectedAddress,
    validateForm,
  }
}