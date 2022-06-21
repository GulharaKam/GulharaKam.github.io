var app = angular.module("myApp", ["ngRoute",  "toastr", "ui.uploader"])
    .run(function($rootScope, $http, $location) {
        $rootScope.sessionData = {};
        $rootScope.profile = function() {
        }

        $rootScope.logout = function() {
        }
    });

app.config(function ($routeProvider) {
    $routeProvider
        .when("/requestclient", {
            templateUrl: "views/requestclient.html",
            controller: "requestclientController"
        })
        .when("/activityreport", {
            templateUrl: "views/activityreport.html",
            controller: "activityreportController"
        })
        .when("/profile", {
            templateUrl: "views/profile.html",
            controller: "profileController"
        })
        .when("/main", {
            templateUrl: "views/main.html",
            controller: "mainController"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginController"
        })
        .otherwise({
            redirectTo: 'main',
        });
});

app.filter('type', function () {
    return function (input) {
        var ext = input.split('.').pop();
        if (['jpg', 'jpeg', 'png', 'bmp'].includes(ext)) return 'image';
        if (['doc', 'docx'].includes(ext)) return 'msword';
        if (['xls', 'xlsx'].includes(ext)) return 'msexcel';
        if (['pdf'].includes(ext)) return 'pdf';
    };
});

app.controller('mainController', function($scope, $rootScope) {
    $rootScope.profile();
});

app.controller('requestclientController', function ($scope, $rootScope, $http, toastr, $filter, uiUploader) {
    $rootScope.profile();
});

app.controller('activityreportController', function ($scope, $rootScope, $http, toastr, uiUploader, $timeout, $filter, $window) {
    $rootScope.profile();
});

app.controller('loginController', function($scope, $rootScope, $http, $rootScope, $location) {
    $rootScope.profile();
});
app.controller('profileController', function($scope, $http, toastr) {
    $scope.profileinfo = {};
    $scope.profileinfouser = [];
});

