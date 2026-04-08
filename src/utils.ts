export async function getLocationFromIP(ip: string) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') return null;
    
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return {
                country: data.country,
                city: data.city,
                region: data.regionName
            };
        }
    } catch (e) {
        console.error("Erro ao resolver IP:", e);
    }
    return null;
}
