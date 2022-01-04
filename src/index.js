import './sass/main.scss';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import FetchImages from './js/fetch-images';
import SimpleLightbox from "simplelightbox";
import imageCardTpl from './templates/image-card.hbs';
import '../node_modules/simplelightbox/dist/simple-lightbox.css';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

const fetchImages = new FetchImages();

let lightbox = new SimpleLightbox('.gallery a');
refs.searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtnHide()

// window.addEventListener('scroll', debounce(onLoadMore, 1000));


async function onFormSubmit(event) {
    event.preventDefault();
    fetchImages.searchQuery = event.currentTarget.searchQuery.value;
    refs.gallery.innerHTML = "";

    if (fetchImages.searchQuery === "") {
        Notiflix.Notify.failure('You entered an empty query!');
        refs.gallery.innerHTML = "";
        loadMoreBtnHide();
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
        refs.loadMoreBtn.addEventListener('click', onLoadMore);


    } catch (error) {
        console.log(error);
    }

};

async function onLoadMore() {

    try {
        const res = await fetchImages.fetchImages();

        if (refs.gallery.querySelectorAll('.image-card').length === res.totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtnHide();
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
    loadMoreBtnShow();
};

function loadMoreBtnHide() {
    if (refs.loadMoreBtn.classList.contains('hidden')) {
        return;
    }
    refs.loadMoreBtn.classList.add('hidden');
};

function loadMoreBtnShow() {
    if (refs.loadMoreBtn.classList.contains('hidden')) {
        refs.loadMoreBtn.classList.remove('hidden');
    }
    return;

};