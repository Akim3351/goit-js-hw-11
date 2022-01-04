import './sass/main.scss';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { Axios } from 'axios';
import FetchImages from './js/fetch-images';
import SimpleLightbox from "simplelightbox";
import imageCardTpl from './templates/image-card.hbs';
import '../node_modules/simplelightbox/dist/simple-lightbox.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
};

const fetchImages = new FetchImages();

let lightbox = new SimpleLightbox('.gallery a');
refs.searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', debounce(onLoadMore, 800));


async function onFormSubmit(event) {
    event.preventDefault();
    fetchImages.searchQuery = event.currentTarget.searchQuery.value;

    if (fetchImages.searchQuery === "") {
        Notiflix.Notify.failure('You entered an empty query!');
       return
    }

    fetchImages.page = 1;

        try {
        const res = await fetchImages.fetchImages();

        if (res.hits.length === 0) {
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            };

        appendMarkup(res.hits);
        Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
        lightbox.refresh();
            
    
        } catch (error) {
            console.log(error);
        }

};

async function onLoadMore() {
    
    try {
        const res = await imageSearch.fetchImages();
     
        if (refs.gallery.querySelectorAll('.image-card').length === res.totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

        } else {
        appendMarkup(res.hits);
        lightbox.refresh();
        }
      
    } catch (error) {
        console.log(error);
    }
}

function appendMarkup(data) {
    refs.gallery.insertAdjacentHTML('beforeend', imageCardTpl(data))
};
