'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { OrderState, IndustryId } from './types'

const defaultOrder: OrderState = {
  industryId: 'hospitality',
  planId:     'growth',
  name:       '',
  business:   '',
  phone:      '',
  email:      '',
  city:       '',
  state:      '',
  size:       '30–60 rooms',
  gst:        '',
  payMethod:  'card',
  ref:        '',
}

interface OrderCtx {
  order:    OrderState
  setOrder: (partial: Partial<OrderState>) => void
}

const Ctx = createContext<OrderCtx>({ order: defaultOrder, setOrder: () => {} })

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrderState] = useState<OrderState>(defaultOrder)
  const setOrder = (partial: Partial<OrderState>) =>
    setOrderState(prev => ({ ...prev, ...partial }))
  return <Ctx.Provider value={{ order, setOrder }}>{children}</Ctx.Provider>
}

export function useOrder() {
  return useContext(Ctx)
}
