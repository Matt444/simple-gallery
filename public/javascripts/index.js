$(document).mousedown(function(event) {
    switch (event.which) {
        case 3:
            console.log('Right Mouse button pressed.');
            // deactivate save image option
            $('img').bind("contextmenu", (e) => false);
            break;
    }
});

let images = [];
let categories = []
let visibleImages = {}
let activeCategories = {
    'ALL': true
}

fetch('/api/images').
then(json => json.json()).
then(data => {
    images = data;
    console.log(images);

    images.forEach(image => {
        visibleImages[image.name] = true;
        
        // updating list of categories
        image.categories.forEach(cat => {
            if(categories.map(c => c.toUpperCase()).indexOf(cat.toUpperCase()) == -1) {
                categories.push(cat.toUpperCase());
            }
        });
    });

    $('#ALL').on('click', () => {
        categories.forEach(category => {
            activeCategories[category] = false;
        });
        activeCategories['ALL'] = true;
        updateVisibleImages();
        showVisibleImages();
        updateCategoriesButtons();
    });
    
    categories.forEach(category => {
        activeCategories[category] = true;
        $('#categories').append(`<button id="${category}" type="button" class="list-group-item list-group-item-action">${category}</button>`);
        $(`#${category}`).on('click', () => {
            console.log('click');
            activeCategories['ALL'] = false;
            categories.forEach(category => {
                activeCategories[category] = false;
            });
            activeCategories[category] = true;
            updateVisibleImages();
            showVisibleImages();
            updateCategoriesButtons();
        });
    });

    showVisibleImages();
}).
catch(err => console.log(err));


function updateVisibleImages() {
    images.forEach(image => {
        visibleImages[image.name] = false;
    });
    categories.forEach(category => {
        if(activeCategories[category]) {
            images.forEach(img => {
                if(img.categories.map(c => c.toUpperCase()).indexOf(category.toUpperCase()) != -1)
                    visibleImages[img.name] = true;
            });
        }
    });
    if(activeCategories['ALL']) {
        images.forEach(image => {
            visibleImages[image.name] = true;
        })
    }
}

function showVisibleImages() {
    $('#gallery>.row>div').remove();
    images.forEach(image => {
        if(visibleImages[image.name]) {
            $('#gallery>.row').append(`<div class="mx-1" >
            <a href="${image.img_path}" data-fancybox="gallery" data-caption="${image.signature}">
                <img src="${image.min_path}" alt="${image.signature}" class="img-thumbnail m-1" data-toggle="modal" data-target="#${'modal' + image.name}">
            </a>
            <p id="signature">${image.signature}</p> 
            </div>`);
        }
    });
}

function handler( event ) {
    var target = $( event.target );
    if ( target.is( "img" ) ) {
        target.bind("contextmenu",function(e){
            return false;
        });
    }
}





function updateCategoriesButtons() {
    categories.forEach(category => {
        if(activeCategories[category]) {
            $(`#${category}`).addClass('active');
        } else {
            $(`#${category}`).removeClass('active');
        }
    });
    if(activeCategories['ALL']) {
        $(`#ALL`).addClass('active');
    } else {
        $(`#ALL`).removeClass('active');
    }
}
