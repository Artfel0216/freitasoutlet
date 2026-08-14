'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import type { SavedAddress, ShippingOption, FieldErrors } from '@/components/checkout/checkout-utils'
import { formatCPF, formatCEP, formatPhone } from '@/components/checkout/checkout-utils'

interface CheckoutInfoFormProps {
  formData: Record<string, string>
  errors: FieldErrors
  updateField: (field: string, value: string) => void
  savedAddresses: SavedAddress[]
  selectedAddressId: string
  selectAddress: (id: string) => void
  clearSelectedAddress: () => void
  shippingOptions: ShippingOption[]
  selectedShipping: string
  setSelectedShipping: (s: string) => void
  lgpdConsent: boolean
  setLgpdConsent: (v: boolean) => void
}

const inputClass = (hasError?: string) =>
  `w-full border px-3 py-2 text-sm focus:outline-none focus:border-black ${hasError ? 'border-red-500' : 'border-border'}`

const fieldLabelClass = 'block text-xs font-medium uppercase tracking-wider mb-1'

export function CheckoutInfoForm({
  formData, errors, updateField,
  savedAddresses, selectedAddressId, selectAddress, clearSelectedAddress,
  shippingOptions, selectedShipping, setSelectedShipping,
  lgpdConsent, setLgpdConsent,
}: CheckoutInfoFormProps) {
  return (
    <motion.div
      key="info"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border">
        1. Dados Pessoais
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={fieldLabelClass}>Nome Completo</label>
          <input type="text" required value={formData.name} onChange={(e) => updateField('name', e.target.value)}
            className={inputClass(errors.name)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>E-mail</label>
          <input type="email" required value={formData.email} onChange={(e) => updateField('email', e.target.value)}
            className={inputClass(errors.email)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>CPF</label>
          <input type="text" required value={formData.cpf} onChange={(e) => updateField('cpf', formatCPF(e.target.value))}
            className={inputClass(errors.cpf)}
            placeholder="000.000.000-00" maxLength={14} />
          {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={fieldLabelClass}>Telefone</label>
          <input type="tel" required value={formData.phone} onChange={(e) => updateField('phone', formatPhone(e.target.value))}
            className={inputClass(errors.phone)}
            placeholder="(11) 99999-9999" maxLength={16} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border pt-4">
        2. Endereço de Entrega
      </h2>

      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          <label className={fieldLabelClass}>Endereço Salvo</label>
          {savedAddresses.map((addr) => (
            <motion.label
              key={addr.id}
              className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                selectedAddressId === addr.id ? 'border-black bg-black/5' : 'border-border hover:border-black'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id}
                onChange={() => selectAddress(addr.id)} className="mt-0.5 accent-black" />
              <div>
                <p className="text-xs font-semibold">{addr.label}</p>
                <p className="text-xs text-muted-foreground">{addr.street}, {addr.number} — {addr.neighborhood}, {addr.city} — {addr.state}</p>
              </div>
            </motion.label>
          ))}
          <button type="button" onClick={clearSelectedAddress}
            className="text-xs underline hover:no-underline text-muted-foreground">
            Usar outro endereço
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={fieldLabelClass}>CEP</label>
          <input type="text" required value={formData.cep} onChange={(e) => updateField('cep', formatCEP(e.target.value))}
            className={inputClass(errors.cep)}
            placeholder="00000-000" maxLength={9} />
          {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={fieldLabelClass}>Endereço</label>
          <input type="text" required value={formData.street} onChange={(e) => updateField('street', e.target.value)}
            className={inputClass(errors.street)} />
          {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>Número</label>
          <input type="text" required value={formData.number} onChange={(e) => updateField('number', e.target.value)}
            className={inputClass(errors.number)} />
          {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>Bairro</label>
          <input type="text" required value={formData.neighborhood} onChange={(e) => updateField('neighborhood', e.target.value)}
            className={inputClass(errors.neighborhood)} />
          {errors.neighborhood && <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>Cidade</label>
          <input type="text" required value={formData.city} onChange={(e) => updateField('city', e.target.value)}
            className={inputClass(errors.city)} />
          {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className={fieldLabelClass}>Estado</label>
          <input type="text" required value={formData.state} onChange={(e) => updateField('state', e.target.value.toUpperCase().slice(0, 2))}
            className={inputClass(errors.state)}
            placeholder="SP" maxLength={2} />
          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
        </div>
      </div>

      {shippingOptions.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wider pb-2 border-b border-border pt-4">
            3. Frete
          </h2>
          {shippingOptions.map((opt) => (
            <motion.label
              key={opt.service}
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                selectedShipping === opt.service ? 'border-black bg-black/5' : 'border-border hover:border-black'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <input type="radio" name="shipping" checked={selectedShipping === opt.service}
                onChange={() => setSelectedShipping(opt.service)} className="accent-black" />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">{opt.service}</p>
                  <p className="text-xs text-muted-foreground">{opt.description} — {opt.deliveryDays} dias úteis</p>
                </div>
                <span className="text-sm font-bold">R$ {opt.price.toFixed(2).replace('.', ',')}</span>
              </div>
            </motion.label>
          ))}
        </div>
      )}

      {formData.state.length === 2 && shippingOptions.length === 0 && (
        <div className="text-xs text-muted-foreground py-2">Calculando frete...</div>
      )}

      <motion.label
        className="flex items-start gap-3 cursor-pointer"
        whileTap={{ scale: 0.99 }}
      >
        <input type="checkbox" checked={lgpdConsent} onChange={(e) => setLgpdConsent(e.target.checked)}
          className="mt-0.5 accent-black" />
        <span className={`text-xs leading-relaxed ${errors.lgpd ? 'text-red-500' : 'text-muted-foreground'}`}>
          Autorizo o tratamento dos meus dados pessoais (nome, CPF, e-mail, telefone e endereço) para fins de
          processamento do pedido, conforme a <a href="#" className="underline">Política de Privacidade</a>.
          Seus dados estão protegidos e não serão compartilhados sem seu consentimento.
        </span>
      </motion.label>
      {errors.lgpd && <p className="text-xs text-red-500">{errors.lgpd}</p>}

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button variant="primary" size="lg" fullWidth type="submit">
          CONTINUAR PARA PAGAMENTO
        </Button>
      </motion.div>
    </motion.div>
  )
}