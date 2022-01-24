import {tokenabi, tokenAddress} from './musoABI'
import { ethers } from "ethers"


export const tokenContract = (buyer, provider)=>{
    let wallet = new ethers.Wallet(buyer, provider)
    const res = new ethers.Contract(tokenAddress, tokenabi, wallet)
    return res
}

export const getUserBalance = async(buyer, provider)=> {
    try {
        const contract = tokenContract(buyer,provider)
        const res = await contract.balanceOf(buyer)
        return res
    }
    catch(err) { 
        console.log('balance err',{err})
        return false 
    }
}

export const getAllowance = async(buyer, provider)=> {
    try {
        const contract = tokenContract(buyer,provider)
        const res = await contract.allowance(buyer, tokenAddress)
        console.log('allowance',res.toNumber())
        return res
    }
    catch(err) { 
        console.log('allowance err',{err})
        return false 
    }
}

export const approveContract = async(buyer, provider)=> {
    try {
        const nonce = await provider.getTransactionCount(buyer)
        const contract = tokenContract(buyer,provider)
        const gas = await contract.estimateGas.approve(tokenAddress, 100000)
        console.log(gas.toNumber())
        const res = await contract.approve(tokenAddress, 100000)
        console.log('approve res',res)
        return gas
    }
    catch(err) { 
        console.log('approve err',{err})
        return false 
    }
}

// // апрув
// export const approve = async(buyer, pool)=> {
//     try {
//         const nonce = await web3.eth.getTransactionCount(buyer)
//         const gas = await tokenContract.methods.approve(
//              web3.utils.toChecksumAddress(pool.contractAddress), 
//             '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
//         ).estimateGas({
//             from:  web3.utils.toChecksumAddress(buyer),
//             gas: '0x' + Number(3000000).toString(16)
//         })
//         const res = await tokenContract.methods.approve(
//              web3.utils.toChecksumAddress(pool.contractAddress), 
//             '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
//         ).send({
//             nonce: '0x' + nonce.toString(16),
//             from:  web3.utils.toChecksumAddress(buyer),
//             gas: '0x' + gas.toString(16)
//         })

//         console.log(res);
//         return res;
//     } catch (e) {
//         console.log(e); 
//         return 0 
//     }
// }