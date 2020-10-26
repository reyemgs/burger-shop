export default class Fetch {
    async loadJSON(url) {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            return data;
        } else {
            console.error(response.status);
        }
    }
}
