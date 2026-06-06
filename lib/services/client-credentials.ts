import {
  buildProviderCredentials,
  findProvider,
  listCompatibleApps,
  type BuiltCredentials,
  type ProviderApp,
  type ProviderCatalogEntry,
} from '@/lib/config/provider-catalog'

// Mapeia nomes de servidor usados no painel para chaves/aliases do catalogo real.
// Mantem compatibilidade com dados existentes (Yellow Box, Ninety, Brasil, etc).
const SERVER_ALIAS: Record<string, string> = {
  'yellow box': 'YELLOW_NOVO',
  'yellow': 'YELLOW_NOVO',
  'yellowbox': 'YELLOW_NOVO',
  'brasil': 'YELLOW_NOVO',
  'brasil / yellow box': 'YELLOW_NOVO',
  'yellow x3': 'YELLOW_X3_ANTIGO',
  'x3': 'YELLOW_X3_ANTIGO',
  'cinemax': 'CINEMAX',
  'ninety': 'NINETY',
  'noventa': 'NINETY',
  'xbr': 'XBR_DEVXTOP',
  'devxtop': 'XBR_DEVXTOP',
  'areaplay': 'AREAPLAY_SIGMA',
  'sigma': 'AREAPLAY_SIGMA',
  'uniplay': 'XBR_DEVXTOP',
}

function normalize(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Resolve o provider do catalogo a partir do nome de servidor do cliente.
 * Usa primeiro o mapa de aliases, depois o lookup nativo do catalogo.
 */
export function resolveProvider(servidor: string): ProviderCatalogEntry | undefined {
  const key = SERVER_ALIAS[normalize(servidor)]
  if (key) {
    const found = findProvider(key)
    if (found) return found
  }
  return findProvider(servidor)
}

export type ClientLike = {
  app: string
  servidor: string
  usuario?: string
  senha?: string
}

/**
 * Constroi as credenciais reais do cliente usando o provider-catalog.
 * Retorna undefined quando o servidor nao existe no catalogo (ex: XCloud puro).
 */
export function buildClientCredentials(client: ClientLike): BuiltCredentials | undefined {
  const provider = resolveProvider(client.servidor)
  if (!provider) return undefined
  try {
    return buildProviderCredentials({
      provider: provider.key,
      app: client.app,
      username: client.usuario,
      password: client.senha,
    })
  } catch {
    return undefined
  }
}

/**
 * Lista os apps compativeis do provider do cliente, com o app atual no topo.
 */
export function listClientCompatibleApps(client: ClientLike): { provider?: ProviderCatalogEntry; apps: ProviderApp[] } {
  const provider = resolveProvider(client.servidor)
  if (!provider) return { provider: undefined, apps: [] }
  return { provider, apps: listCompatibleApps(provider.key) }
}

export function isXCloud(app: string): boolean {
  return normalize(app).includes('xcloud')
}
