/*
 * Cloud computing activity
 * endpoint: compute/v1/
 */

export async function getCloudComputingProviders() {
    /**
     * Get a list of cloud computing providers
     * Endpoint: https://api.climatiq.io/compute/v1/metadata
     * @returns {object} - A list of cloud computing providers
     * @throws {Error} - An error occurred while fetching the data
     */
    try {
        // Using Fetch API
        const response = await fetch('https://api.climatiq.io/compute/v1/metadata', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_CLIMATIQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function calculateCloudComputingVMFootprint(provider: string, instance: string, region: string, duration: number) {
    /**
     * Calculate the carbon footprint of a virtual machine instance
     * Endpoint: POST /compute/v1/{provider}/instance
     * @param {string} provider - The cloud provider of the virtual machine instance
     * @param {string} instance - The type of the virtual machine instance
     * @param {string} region - The region where the virtual machine instance is hosted
     * @param {number} duration - The duration of the virtual machine instance in hours
     * @returns {object} - The carbon footprint of the virtual machine instance
     * @throws {Error} - An error occurred while fetching the data
     */
    try {
        const response = await fetch(`https://api.climatiq.io/compute/v1/${provider}/instance`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_CLIMATIQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                instance,
                region,
                duration,
                duration_unit: 'h',
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error in calculateCloudComputingVMFootprint: ", error);
        throw error;
    }
}

export async function calculateCloudComputingCPUFootprint(provider: string, region: string, cpu_count: number, duration: number) {
    /**
     * Calculate total estimated use-phase emissions based on the electricity usage for a set number of virtual CPU's (vCPUs)
     * Endpoint: POST /compute/v1/:provider/cpu
     * @param {string} provider - The cloud provider of the virtual machine instance
     * @param {string} region - The region where the virtual machine instance is hosted
     * @param {number} cpu_count - The number of virtual cores you are calculating for. Note that vCPU load is fixed at 50%.
     * @param {number} duration - The duration of the vCPU are running for in hours
     * @returns {object} - The carbon footprint of the vCPU
     * @throws {Error} - An error occurred while fetching the data
     */
    try {
        const response = await fetch(`https://api.climatiq.io/compute/v1/${provider}/cpu`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_CLIMATIQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                region,
                cpu_count,
                duration,
                duration_unit: 'h',
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error in calculateCloudComputingCPUFootprint: ", error);
        throw error;
    }
}

export async function calculateCloudComputingStorageFootprint(provider: string, region: string, storage_type: string, data: number, duration: number) {
    /**
     * Calculate the carbon footprint of a storage service
     * Endpoint: POST /compute/v1/:provider/storage
     * @param {string} provider - The cloud provider of the storage service
     * @param {string} region - The region where the storage service is hosted
     * @param {string} storage_type - The type of the storage service (ssd or hdd)
     * @param {number} data - The amount of data stored in the storage service in GB
     * @param {number} duration - The duration of the storage service in hours
     * @returns {object} - The carbon footprint of the storage service
     * @throws {Error} - An error occurred while fetching the data
     */
    try {
        const response = await fetch(`https://api.climatiq.io/compute/v1/${provider}/storage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_CLIMATIQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                region,
                storage_type,
                data,
                data_unit: 'GB',
                duration,
                duration_unit: 'h',
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error in calculateCloudComputingStorageFootprint: ", error);
        throw error;
    }
}

export async function calculateCloudComputingMemoryFootprint(provider: string, region: string, data: number, duration: number) {
    /**
     * Calculate the carbon footprint of a memory service
     * Endpoint: POST /compute/v1/:provider/memory
     * @param {string} provider - The cloud provider of the memory service
     * @param {string} region - The region where the memory service is hosted
     * @param {number} data - The amount of memory stored in the memory service in MB
     * @param {number} duration - The duration of the memory service in hours
     * @returns {object} - The carbon footprint of the memory service
     * @throws {Error} - An error occurred while fetching the data
     */
    try {
        const response = await fetch(`https://api.climatiq.io/compute/v1/${provider}/memory`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VUE_APP_CLIMATIQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                region,
                data,
                data_unit: 'MB',
                duration,
                duration_unit: 'h',
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error in calculateCloudComputingMemoryFootprint: ", error);
        throw error;
    }
}

/*
 * Flights activity
 */


/*
 * Custom activities
 */