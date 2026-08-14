import 'server-only'

const STORE_PIX_KEY = process.env.STORE_PIX_KEY ?? ''
const STORE_NAME = process.env.STORE_NAME ?? ''

if (!STORE_PIX_KEY) throw new Error('STORE_PIX_KEY não configurada')
if (!STORE_NAME) throw new Error('STORE_NAME não configurado')

type PixPayload = {
  qrCode: string
  pixKey: string
  txId: string
  expiresAt: string
}

export function generatePixPayload(cpf: string, value: number, name: string): PixPayload {
  const txId = crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 25)
  const valueFormatted = value.toFixed(2).replace('.', '')
  const nameFormatted = STORE_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 25)

  const payload = [
    '000201',
    '26580014BR.GOV.BCB.PIX0136',
    STORE_PIX_KEY,
    '52040000',
    '5303986',
    `54${String(valueFormatted.length).padStart(2, '0')}${valueFormatted}`,
    '5802BR',
    `59${String(nameFormatted.length).padStart(2, '0')}${nameFormatted}`,
    '6008BRASILIA',
    '62070503***',
    `6304`,
  ].join('')

  const crc16 = calculateCRC16(payload)
  const fullPayload = payload + crc16

  return {
    qrCode: fullPayload,
    pixKey: STORE_PIX_KEY,
    txId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }
}

function calculateCRC16(data: string): string {
  let crc = 0xFFFF
  const polynomial = 0x1021

  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc = crc << 1
      }
      crc &= 0xFFFF
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
}
