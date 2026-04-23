export interface StatusConfig {
  label: string;
  css: string;
}

// Estados traducidos y su estilo.
export const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  pending: {
    label: 'Pendiente',
    css: 'bg-yellow-100 text-yellow-700',
  },
  paid: {
    label: 'Pagado',
    css: 'bg-blue-100 text-blue-700',
  },
  shipped: {
    label: 'Enviado',
    css: 'bg-purple-100 text-purple-700',
  },
  delivered: {
    label: 'Entregado',
    css: 'bg-green-100 text-green-700',
  },
  cancelled: {
    label: 'Cancelado',
    css: 'bg-red-100 text-red-700',
  },
};
// Devuelve el estado segun el parámetro.
export function getOrderStatusInfo(status: string): StatusConfig {
  const badgeBaseStyle = 'px-3 py-1 text-xs font-bold rounded-full uppercase';
  const statusMap = ORDER_STATUS_MAP[status];

  return {
    label: statusMap?.label || status,
    css: `${badgeBaseStyle} ${statusMap?.css || 'bg-gray-100 text-gray-700'}`,
  };
}
