    const axios = require('axios');
    const BASEURL = 'https://pixabay.com';
    const KEY = '22674191-752cb48b0c59e5e1d0dc96fed';

export default class ImageSearch {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
    }
    async fetchImages() {
        const url = `${BASEURL}/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;    
        // console.log(this.searchQuery);
        const response = await axios.get(url);
        this.page += 1;
        console.log(response.data);
        return response.data;
    }
    resetPage() {
        this.page = 1
    }
}