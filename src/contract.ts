import {tokenabi, tokenAddress} from './musoABI'
import { ethers } from "ethers"

// export const getWallet = (pub_key, provider)=>{
//     let wallet = new ethers.Wallet(pub_key, provider)
//     console.log('wallet',wallet)
//     return wallet
// }

export const tokenContract = (buyer, provider)=>{
    let wallet = new ethers.Wallet(buyer, provider)
    console.log('wallet', wallet)
    const res = new ethers.Contract(tokenAddress, tokenabi, wallet)
    return res
}

//  = new web3.eth.Contract(tokenabi, tokenAddress)

// export const connectProvider = (provider) => web3.setProvider(provider)


export const getUserBalance = async(buyer, provider)=> {
    if(!buyer || !provider){
        console.log('give me my arguments')
        return false
    }
    try {
        console.log('getAllowance params', {buyer, provider})
        const res = await tokenContract(tokenAddress, provider).balanceOf(buyer)
        // const res = await tokenContract(tokenAddress, provider).balanceOf(tokenAddress, 999999)
        // const res = await tokenContract(provider).allowance(buyer, tokenAddress)
        
        return res
    }
    catch(err) { 
        console.log('allowance err',{err})
        return false 
    }
}

// // апрув
// export const approve = async(buyer, pool)=> {
//     try {
//         const nonce = await  web3.eth.getTransactionCount(buyer)
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