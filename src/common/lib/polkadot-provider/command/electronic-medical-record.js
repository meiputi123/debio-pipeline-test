export async function registerElectronicMedicalRecord(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecord(data.title, data.category)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function deregisterElectronicMedicalRecord(api, pair, emrId) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecord(emrId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function addElectronicMedicalRecordFile(api, pair, data) {
  const result = await api.tx.electronicMedicalRecord
    .addElectronicMedicalRecordFile(data.id, data.title, data.description, data.recordLink)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}

export async function removeElectronicMedicalRecordFile(api, pair, fileId) {
  const result = await api.tx.electronicMedicalRecord
    .removeElectronicMedicalRecordFile(fileId)
    .signAndSend(pair, { nonce: -1 })
  return result.toHuman()
}
