import { queryServicesById } from './services'
import { queryLabsById } from './labs'
import { getOrdersDetail } from './orders'

export async function queryDnaSamples(api, bytes){
    const res = await api.query.geneticTesting.dnaSamples(bytes)
    return res.toHuman()
}

export async function queryDnaSamplesByLab(api, labId){
    const res = await api.query.geneticTesting.dnaSamplesByLab(labId)
    return res.toHuman()
}

export async function queryDnaSamplesByOwner(api, ownerId){
    const res = await api.query.geneticTesting.dnaSamplesByOwner(ownerId)
    return res.toHuman()
}

export async function queryDnaTestResults(api, bytes){
    const res = await api.query.geneticTesting.dnaTestResults(bytes)
    return res.toHuman()
}

export async function queryDnaTestResultsByLab(api, labId){
    const res = await api.query.geneticTesting.dnaTestResultsByLab(labId)
    return res.toHuman()
}

export async function getDnaTestResultsDetailByLab(api, labId){
    try{
        const resultIds = await queryDnaTestResultsByLab(api, labId)
        let resultsWithDetail = []
        if(resultIds != null){
            for(let i = 0; i < resultIds.length; i++){
                let resultDetail = await queryDnaSamples(api, resultIds[i])
                let orderDetail = await getOrdersDetail(api, resultDetail.orderId)
                let createdAtTimestamp = orderDetail.createdAt
                const service = await queryServicesById(api, orderDetail.serviceId)
                const lab = await queryLabsById(api, service.ownerId)
                orderDetail['createdAt'] = (new Date(createdAtTimestamp)).toLocaleDateString()
                orderDetail['lab_name'] = lab.info.name
                orderDetail['service_name'] = service.info.name
                resultDetail['order'] = orderDetail
                resultsWithDetail.push(resultDetail)
            }
        }
        return resultsWithDetail
    }
    catch(err){
        console.error(err)
    }
}

export async function queryDnaTestResultsByOwner(api, ownerId){
    const res = await api.query.geneticTesting.dnaTestResultsByOwner(ownerId)
    return res.toHuman()
}