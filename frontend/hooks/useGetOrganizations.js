import { useEffect, useState } from "react"
import axios from "axios"
import { BACKED_BASE_URL } from "@env";

console.log("Backend:", BACKED_BASE_URL);


export const useGetOrganizations = async () => {
    const [organizations, setOrganizations] = useState([])
    const handleRetrieveOrganization = async () => {

        try {
            const organizationResponse = await axios.get(`http://10.162.212.249:8000/api/v1/organizations/get-organizations`)
            if (organizationResponse.status !== 200) {
                console.log("The response failed")
                return
            }
            setOrganizations(organizationResponse.data.data)
        } catch (error) {
            console.error("Failed to fetch organization", error)
        }
    }
    useEffect(() => {
        handleRetrieveOrganization()
    }, [])

    return { organizations }
}