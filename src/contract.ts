import { threeMonthsAddress, threeMonthsAbi } from './threeABI';
import { sixMonthsAddress, sixMonthsAbi } from './sixABI';
import { twelveMonthsAddress, twelveMonthsAbi } from './twelveABI';
import {tokenabi, tokenAddress} from './wbnbABI'
import { ethers } from "ethers"
import {IStaked, IWeb3Props, IStake} from './types'

const _Contract = (buyer, provider, contractAddress, contractAbi)=>{
    const prov = new ethers.providers.Web3Provider(provider.provider)
    const signer = prov.getSigner(buyer)
    const res = new ethers.Contract(contractAddress, contractAbi, prov)
    let currentContract = res.connect(signer)
    return currentContract
}

const _decimals = async(buyer, provider)=> {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
        const res = await tokenContract.decimals()
        return res
    }
    catch(err) { 
        console.log('decimals err',{err})
        return false 
    }
}

export const getUserBalance = async({buyer, provider}:IWeb3Props)=> {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
        
        const res = await tokenContract.balanceOf(buyer)
        const tokenDecimals = await _decimals(buyer, provider)
        const formatRes = tokenDecimals && ethers.utils.formatUnits(res, tokenDecimals)
        return parseFloat(formatRes)
    }
    catch(err) { 
        console.log('balance err',{err})
        return 0 
    }
}

const _getAllowance = async(buyer, provider, monthAddress)=> {
    try {
        const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
        const res = await tokenContract.allowance(buyer, monthAddress)
        return +res.toString()
    }
    catch(err) { 
        console.log('allowance err',{err})
        return 0 
    }
}

const _approveContract = async(buyer, provider, monthAddress)=> {
    const tokenContract = _Contract(buyer, provider, tokenAddress, tokenabi)
    try {
        const res = await tokenContract.approve(monthAddress, monthAddress)
        console.log('approve res', res)
        return res
    }
    catch(err) { 
        console.log('approve err',{err})
        return false 
    }
}

export const stake = async({buyer, provider, amount, time, setStaked, setStakeProcess }:IStake)=>{
    setStakeProcess({
        val:25,
        message: 'Start staking'
    })
    const tokenDecimals = await _decimals(buyer, provider)
    const stakeAmount = ethers.utils.parseUnits(''+amount, tokenDecimals)
    const _monthStake = async(monthAddress, monthAbi)=>{
        const monthContract = _Contract(buyer, provider, monthAddress, monthAbi)
        const _stake = async()=>{
            try {
                const res = await monthContract.stake(stakeAmount)
                return res
            } catch (error) {
                return error
            }
        }
        
        try {
            const contractAllowance = await _getAllowance(buyer, provider, monthAddress)
            if(contractAllowance && contractAllowance > 0){
                setStakeProcess({
                    val:50,
                    message: 'Confirming stake'
                })
                let stake = await _stake()
                !!stake && setStakeProcess({
                    val:75,
                    message: 'Transaction in process'
                })
                provider.once(stake.hash, (res)=>{
                    setStakeProcess({
                        val:99,
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
            }else{
                const monthApprove = await _approveContract(buyer, provider, monthAddress)
                console.log(monthApprove)
                !!monthApprove && setStakeProcess({
                    val:50,
                    message: 'Approving contract'
                })
                monthApprove ? provider.once(monthApprove.hash, async() => {
                    setStakeProcess({
                        val:75,
                        message: 'Transaction in process'
                    })
                    let stake = await _stake()
                    provider.once(stake.hash, res=>{
                        setStakeProcess({
                            val:99,
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
    switch (time) {
        case 3:
            await _monthStake(threeMonthsAddress, threeMonthsAbi)
            break;
    
        case 6:
            await _monthStake(sixMonthsAddress, sixMonthsAbi)
            break;
    
        case 12:
            await _monthStake(twelveMonthsAddress, twelveMonthsAbi)
            break;
    
        case 0:
            await _monthStake(threeMonthsAddress, threeMonthsAbi)
            break;
    
        default:
            console.log('stake error')
            break;
    }
}

export const getUserStakes = async(buyer, provider)=>{
    const threeContract = _Contract(buyer, provider, threeMonthsAddress, threeMonthsAbi)
    const sixContract = _Contract(buyer, provider, sixMonthsAddress, sixMonthsAbi)
    const twelveContract = _Contract(buyer, provider, twelveMonthsAddress, twelveMonthsAbi)
    try {
        let three = await threeContract.userDataMapping(buyer)
        let six = await sixContract.userDataMapping(buyer)
        let twelve = await twelveContract.userDataMapping(buyer)
        const tokenDecimals = await _decimals(buyer, provider)
        
        return [
            {
                amount: parseFloat(ethers.utils.formatUnits(three.balance, tokenDecimals)),
                time: 3,
                unlockTime: new Date((three.expiration.toNumber())*1000),
                bigAmount: three.balance
            },
            {
                amount: parseFloat(ethers.utils.formatUnits(six.balance, tokenDecimals)),
                time: 6,
                unlockTime: new Date((six.expiration.toNumber())*1000),
                bigAmount: six.balance
            },
            {
                amount: parseFloat(ethers.utils.formatUnits(twelve.balance, tokenDecimals)),
                time: 12,
                unlockTime: new Date((twelve.expiration.toNumber())*1000),
                bigAmount: twelve.balance
            },
        ]
    } catch (error) {
        console.log('getUserStakes', error)
    }
}

export const getEarned = async(buyer, provider)=>{
    const threeContract = _Contract(buyer, provider, threeMonthsAddress, threeMonthsAbi)
    const sixContract = _Contract(buyer, provider, sixMonthsAddress, sixMonthsAbi)
    const twelveContract = _Contract(buyer, provider, twelveMonthsAddress, twelveMonthsAbi)
    try {
        const tokenDecimals = await _decimals(buyer, provider)
        const threeEarned = await threeContract.earned(buyer)
        const sixEarned = await sixContract.earned(buyer)
        const twelveEarned = await twelveContract.earned(buyer)
        return [
            ethers.utils.formatUnits(threeEarned, tokenDecimals), 
            ethers.utils.formatUnits(sixEarned, tokenDecimals), 
            ethers.utils.formatUnits(twelveEarned, tokenDecimals)
        ]
    } catch (error) {
        console.log('getEarned', error)
        return false
    }
}

export const withdraw = async(buyer, provider, time, amount)=>{
    // const threeContract = _Contract(buyer, provider, threeMonthsAddress, threeMonthsAbi)
    // const sixContract = _Contract(buyer, provider, sixMonthsAddress, sixMonthsAbi)
    const twelveContract = _Contract(buyer, provider, tokenAddress, tokenabi)
    try {
        let res = await twelveContract.withdraw(4753883598938090)
        console.log(res)
    } catch (error) {
        console.log(error)
    }
    // const monthWithdraw = async(monthContract)=>{
    //     try {
    //         const tokenDecimals = await _decimals(buyer, provider)
    //         const stakeAmount = ethers.utils.parseUnits(''+amount, tokenDecimals)
    //         const res = await monthContract.withdraw(amount)
    //         console.log('monthWithdraw', res)
    //     } catch (error) {
    //         console.log('withdraw', error)
    //         return false
    //     }
    // }

    // switch (time) {
    //     case 3:
    //         monthWithdraw(threeContract)
    //         break;
    
    //     case 6:
    //         monthWithdraw(sixContract)
    //         break;
    
    //     case 12:
    //         monthWithdraw(twelveContract)
    //         break;
    
    //     default:
    //         break;
    // }
}