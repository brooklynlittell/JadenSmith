// Templates
app.subviewPath = '../../views/subviews/';
app.directive('images', function() {
    return {
        templateUrl: app.subviewPath + 'images.html'
    };
});

app.directive('image', function() {
    return {
        templateUrl: app.subviewPath + 'image.html'
    };
});

app.directive('editimage', function() {
    return {
        templateUrl: app.subviewPath + 'editImage.html'
    };
});
app.directive('errorMessage', function() {
    return {
        templateUrl: app.subviewPath + 'errorImage.html'
    };
});