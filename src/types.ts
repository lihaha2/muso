import type {Dispatch, SetStateAction} from 'react'

export interface IProps {
    loading: boolean,
    setLoading: (loading: boolean) => void
}
  
export interface IStaked {
  err: {
    message: string,
    error: any
  } | boolean,
  staked: boolean,
  progress: number,
  res?: any,
  trantaction?: any
}

export interface ILoader {
    loading: boolean,
    className?: any,
    process?: {
        val: number,
        message: string
    },
}

export interface IWeb3Props {
    buyer: string,
    provider: any
}
export interface ILoadingProgress {
    val: number,
    message: string
}

export interface IStake {
    buyer: string,
    provider: any, 
    amount: number, 
    time: number, 
    setStaked: Dispatch<SetStateAction<IStaked>>, 
    setStakeProcess: Dispatch<SetStateAction<ILoadingProgress>>
}