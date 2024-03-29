import { threeMonthsAddress, threeMonthsAbi } from './threeABI';
import { sixMonthsAddress, sixMonthsAbi } from './sixABI';
import { twelveMonthsAddress, twelveMonthsAbi } from './twelveABI';
import { tokenabi, tokenAddress } from './wbnbABI'
import { ethers } from "ethers"
import { IStaked, IWeb3Props, IStake, IReStake } from './types'

const contractType = {
    3: { addr: threeMonthsAddress, abi: threeMonthsAbi },
    6: { addr: sixMonthsAddress, abi: sixMonthsAbi },
    12: { addr: twelveMonthsAddress, abi: twelveMonthsAbi },
}

const _Contract = (buyer, provider, contractAddress, contractAbi) => {
    const prov = new ethers.providers.Web3Provider(provider.provider)
    const signer = prov.getSigner(buyer)
    const res = new ethers.Contract(contractAddress, contractAbi, prov)
    let currentContract = res.connect(signer)
    return currentContract
}

const _decimals = async (buyer, provider) => {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
        const res = await tokenContract.decimals()
        return res
    }
    catch (err) {
        console.log('decimals err', { err })
        return 9
    }
}

const _getAllowance = async (buyer, provider, monthAddress) => {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
        const res = await tokenContract.allowance(buyer, monthAddress)
        return +res.toString()
    }
    catch (err) {
        console.log('allowance err', { err })
        return 0
    }
}

const _approveContract = async (buyer, provider, monthAddress) => {
    const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
    try {
        const res = await tokenContract.approve(monthAddress, monthAddress)
        return res
    }
    catch (err) {
        console.log('approve err', { err })
        return false
    }
}

export const signMessage = async({provider, buyer, message}:{provider: any, buyer: string, message: string})=>{
    const prov = new ethers.providers.Web3Provider(provider.provider)
    const signer = prov.getSigner(buyer)
    const res = await signer.signMessage(message+'')
    return res
}

export const getUserBalance = async ({ buyer, provider }: IWeb3Props) => {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)

        const res = await tokenContract.balanceOf(buyer)
        const tokenDecimals = await _decimals(buyer, provider)
        const formatRes = tokenDecimals && ethers.utils.formatUnits(res, tokenDecimals)
        return parseFloat(formatRes)
    }
    catch (err) {
        console.log('balance err', { err })
        return 0
    }
}

export const stake = async ({ buyer, provider, amount, time, setStaked, setStakeProcess }: IStake) => {
    setStakeProcess({
        val: 25,
        message: 'Start staking'
    })
    const tokenDecimals = await _decimals(buyer, provider)
    const stakeAmount = ethers.utils.parseUnits(`${amount.toFixed(tokenDecimals)}` , tokenDecimals)
    const monthContract = _Contract(buyer, provider, contractType[time].addr, contractType[time].abi)
    const _stake = async () => {
        try {
            const stakes = await monthContract.getAllStakes(buyer)
            const res = await monthContract.stake(stakeAmount, stakes.length)
            return res
        } catch (error) {
            console.log('_stake', {error})
            return false
        }
    }

    try {
        const contractAllowance = await _getAllowance(buyer, provider, contractType[time].addr)
        if (contractAllowance && contractAllowance > 0) {
            setStakeProcess({
                val: 50,
                message: 'Confirming stake'
            })
            let stake = await _stake()
            !!stake && setStakeProcess({
                val: 75,
                message: 'Transaction in process'
            })
            provider.once(stake.hash, (res) => {
                setStakeProcess({
                    val: 99,
                    message: 'Staked!'
                })
                setStaked({
                    err: false,
                    staked: true,
                    progress: 100,
                    res: res,
                    trantaction: stake
                })
            })
        } else {
            const monthApprove = await _approveContract(buyer, provider, contractType[time].addr)
            !!monthApprove && setStakeProcess({
                val: 50,
                message: 'Approving contract'
            })
            monthApprove ? provider.once(monthApprove.hash, async () => {
                setStakeProcess({
                    val: 75,
                    message: 'Transaction in process'
                })
                let stake = await _stake()
                provider.once(stake.hash, res => {
                    setStakeProcess({
                        val: 99,
                        message: 'Staked!'
                    })
                    setStaked({
                        err: false,
                        staked: true,
                        progress: 100,
                        res: res,
                        trantaction: stake
                    })
                })
            }) : setStaked({
                err: {
                    message: 'Error with approve',
                    error: monthApprove
                },
                staked: false,
                progress: 100,
                trantaction: monthApprove
            })
        }
    } catch (error) {
        console.log('stake', {error})
        return setStaked({
            err: {
                message: 'Error with stake',
                error: error
            },
            staked: false,
            progress: 100
        })
    }

}

export const getUserStakes = async (buyer, provider): Promise<any[]> => {
    const threeContract = _Contract(buyer, provider, contractType[3].addr, contractType[3].abi)
    const sixContract = _Contract(buyer, provider, contractType[6].addr, contractType[6].abi)
    const twelveContract = _Contract(buyer, provider, contractType[12].addr, contractType[12].abi)
    try {
        let three = await threeContract.getAllStakes(buyer)
        let six = await sixContract.getAllStakes(buyer)
        let twelve = await twelveContract.getAllStakes(buyer)
        const tokenDecimals = await _decimals(buyer, provider)
        const monthReturn = (monthFunc, time) => monthFunc.map((el, key) => {
            return {
                amount: parseFloat(ethers.utils.formatUnits(el.balance, tokenDecimals)),
                reward: parseFloat(ethers.utils.formatUnits(el.reward, tokenDecimals)),
                userRewardPerTokenPaid: parseFloat(ethers.utils.formatUnits(el.userRewardPerTokenPaid, tokenDecimals)),
                time,
                key,
                unlockTime: new Date((el.expiration.toNumber()) * 1000),
                startTime: new Date((el.dateOfStart.toNumber()) * 1000),
                bigAmount: el.balance
            }
        })
        return [
            ...monthReturn(three, 3),
            ...monthReturn(six, 6),
            ...monthReturn(twelve, 12)
        ]
    } catch (error) {
        console.log('getUserStakes', {...error})
        return []
    }
}

export const getReward = async ({
    buyer, 
    provider, 
    key, 
    time, 
    setStaked, 
    setStakeProcess, 
    setRewardError 
}) => {
    setStakeProcess({
        val: 25,
        message: 'Sending transaction'
    })
    const monthContract = _Contract(buyer, provider, contractType[time].addr, contractType[time].abi)
    try {
        setStakeProcess({
            val: 50,
            message: 'Confirming transaction'
        })

        let res = await monthContract.withdraw(key)

        setStakeProcess({
            val: 75,
            message: 'Waiting for reward'
        })
        provider.once(res.hash, res => {
            setStakeProcess({
                val: 99,
                message: 'Success!'
            })
            setStaked({
                err: false,
                staked: true,
                progress: 100,
                res: res,
                trantaction: stake
            })
        })
    } catch (error) {
        console.log('getReward', error)
        setStaked({
            err: {
                message: 'Error with getting reward',
                error: error
            },
            staked: false,
            progress: 100
        })
        error?.data?.message === "execution reverted: It is not stake time yet" &&
            setRewardError("Lock period is not finished!")
    }
}

export const reStake = async ({ buyer, provider, key, time, setStaked, setStakeProcess }: IReStake) => {
    setStakeProcess({
        val: 25,
        message: 'Start staking'
    })
    const monthContract = _Contract(buyer, provider, contractType[time].addr, contractType[time].abi)

    try {
        setStakeProcess({
            val: 50,
            message: 'Confirming stake'
        })
        let stake = await monthContract.reStake(buyer, key)
        !!stake && setStakeProcess({
            val: 75,
            message: 'Transaction in process'
        })
        provider.once(stake.hash, res => {
            setStakeProcess({
                val: 99,
                message: 'Staked!'
            })
            setStaked({
                err: false,
                staked: true,
                progress: 100,
                res: res,
                trantaction: stake
            })
        })
    } catch (error) {
        return setStaked({
            err: {
                message: 'Error with stake',
                error: error
            },
            staked: false,
            progress: 100
        })
    }

}