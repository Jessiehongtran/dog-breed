let masonry = document.getElementsByClassName('masonry')[0];
const loading = document.createElement('i');
loading.setAttribute('class', 'fa-solid fa-spinner-third');
let images = []
let images_to_show = []
let image_num = 15;
let count = 1;
let pre_wheel_count = 0;
let wheel_count = 0;
let time_per_scroll = 40;
const image_width = 260;

const getData = async () => {
    const response = await fetch(`https://dog.ceo/api/breed/hound/images`);
    var data = await response.json();
    images = data.message;
    updateImages();
}

const updateImages = () => {
    const new_images = images.slice(images_to_show.length, images_to_show.length + image_num*count);
    if (images_to_show.length + image_num*count <= images.length) {
        images_to_show = images_to_show.concat(new_images)
    }

    masonry.appendChild(loading);

    for (let image of new_images) {
        const each = document.createElement('img');
        each.src = image;
        each.style.margin = '5px';
        each.style.width = `${image_width}px`;
        each.style.borderRadius = '6px';
        each.setAttribute('class', 'item');
        masonry.appendChild(each);
    } 

    displayMasonry();

}

const displayMasonry = () => {
    let rowGap = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-row-gap'));
    let rowHeight = parseInt(window.getComputedStyle(masonry).getPropertyValue('grid-auto-rows'));
    let k = 0;
    for (let image of images_to_show) {
        let item = document.getElementsByClassName('item')[k];
        var rowSpan = Math.ceil((item.getBoundingClientRect().height + rowGap)/(rowHeight + rowGap));
        item.style.gridRowEnd = 'span '+rowSpan;
        k += 1
    }
}

const onresize = () => {
    let browser_width = document.body.clientWidth;
    masonry.style.gridTemplateColumns = `repeat(${Math.floor(browser_width/image_width)}, 1fr)`
    displayMasonry();
}

getData();

masonry.addEventListener('wheel', () => {
    const delta = Math.sign(event.deltaY);
    if (delta === 1) {
        wheel_count += 1
        if (wheel_count - pre_wheel_count > time_per_scroll) {
            count += 1
            updateImages();
            pre_wheel_count = wheel_count
            wheel_count = 0;
        }
    }
})

window.addEventListener('resize', onresize);