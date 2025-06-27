// modules/speed-test.js

/**
 * Cria um payload de teste com o tamanho especificado
 * @param {Number} size Tamanho do payload em bytes
 * @returns {Buffer} Buffer com o tamanho especificado
 */
function createTestPayload(size) {
    return Buffer.alloc(size);
}

/**
 * Calcula a velocidade com base no tamanho e duração
 * @param {Number} sizeBytes Tamanho em bytes
 * @param {Number} durationSeconds Duração em segundos
 * @returns {Number} Velocidade em Mbps
 */
function calculateSpeed(sizeBytes, durationSeconds) {
    const bits = sizeBytes * 8;
    return bits / durationSeconds / 1_000_000; // Mbps
}

module.exports = {
    createTestPayload,
    calculateSpeed
};