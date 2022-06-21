var app = angular.module("myApp", ["ngRoute", "toastr", "vcRecaptcha"])
.run(function($rootScope, $anchorScroll) {
    $rootScope.scroll = function () {
        $anchorScroll();
      };
});

app.config(function($routeProvider) {
    $routeProvider
        .when("/listanalyzes", {
            templateUrl: "views/listanalyzes.html",
            controller: "listanalyzesController"
        })
        .when("/aboutdoctor", {
            templateUrl: "views/aboutdoctor.html",
            controller: "aboutdoctorController"
        })
        .when("/contacts", {
            templateUrl: "views/contacts.html",
            controller: "contactsController"
        })
        .when("/forpatient", {
            templateUrl: "views/forpatient.html",
            controller: "forpatientController"
        })
        .when("/reviews", {
            templateUrl: "views/reviews.html",
            controller: "reviewsController"
        })
        .when("/clinic", {
            templateUrl: "views/clinic.html",
            controller: "clinicController"
        })
        .when("/consultationemail", {
            templateUrl: "views/consultationemail.html",
            controller: "consultationemailController"
        })
        .when("/anesthesia", {
            templateUrl: "views/anesthesia.html",
            controller: "anesthesiaController"
        })
        .when("/main", {
            templateUrl: "views/main.html",
            controller: "mainController"
        })
        .otherwise({
            redirectTo: 'main',
        });

});

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.controller('mainController', function($scope, $http, toastr, $filter) {
    $scope.typeswork = {};
    $scope.typesworks = [];
    $scope.forpatient = {};
    $scope.forpatients = [];

    var worksdata = [];
    $http.get("/php_backend/index.php?method=load_news").then(function(data) {
        $scope.typeswork = data.data;
        angular.forEach($scope.typeswork, function(work, work_id) {
            angular.forEach(work, function(worknote, worknote_id) {
                worksdata.push({ "id": worknote.id, "name": worknote.name});
            });
        });
        $scope.typesworks = worksdata;
    });

    var patientdata = [];
    $http.get("/php_backend/index.php?method=patientinfo").then(function(data) {
        $scope.forpatient = data.data;
       
        angular.forEach($scope.forpatient, function(info, info_id) {
            angular.forEach(info, function(infonote, infonote_id) {
                patientdata.push({ "id": infonote.id, "name": infonote.name, "patch": infonote.patch});
            });
        });
        $scope.forpatients = patientdata;
        console.log($scope.forpatients);
    });
    
});

app.controller('clinicController', function($scope, $http) {

});
app.controller('consultationemailController', function($scope, $http, toastr) {
    $scope.patient = {};
    $scope.submit = function() {
        $scope.submited = true;
        $http.post("/php_backend/postmail.php", $scope.patient).then(function(data) {
            toastr.success('Ваше письмо отправлено', { progressBar: true, closeButton: true });
            $scope.submited = false;
            $scope.patient = {};
        }, function(data) {
            toastr.error('Проверьте правильность заполнения формы.', { progressBar: true, closeButton: true });
            $scope.submited = false;
        })
    };
});

app.controller('forpatientController', function($scope, $http, toastr, vcRecaptchaService) {
    $scope.patient = {};
    $scope.area = {};
    $scope.areacity = [];
    $scope.submited = false;
    $scope.forpatient = {};
    $scope.forpatients = [];

    var areadata = [];
    $http.get("/php_backend/index.php?method=area").then(function(data) {
        $scope.area = data.data;
        angular.forEach($scope.area, function(area, area_id) {
            angular.forEach(area, function(areanote, areanote_id) {
                areadata.push({ "id": areanote.id, "name": areanote.name });
            });
        });
        $scope.areacity = areadata;
    });

    var patientdata = [];
    $http.get("/php_backend/index.php?method=patientinfo").then(function(data) {
        $scope.forpatient = data.data;
        angular.forEach($scope.forpatient, function(info, info_id) {
            angular.forEach(info, function(infonote, infonote_id) {
                patientdata.push({ "id": infonote.id, "name": infonote.name, "patch": infonote.patch});
            });
        });
        $scope.forpatients = patientdata;
    });

    $scope.submit = function() {
		if(vcRecaptchaService.getResponse() === ""){
            toastr.warning('Кликните "Я не робот"', { progressBar: true, closeButton: true });
        }else{
		$scope.patient.recapt=vcRecaptchaService.getResponse();
        $scope.submited = true;
        $http.post("/php_backend/postphp.php", $scope.patient).then(function(data) {
            toastr.success('Спасибо большое! Вы оставили отзыв.', { progressBar: true, closeButton: true });
            $scope.submited = false;
            $scope.patient = {};
        }, function(data) {
            toastr.error('Вы не заполнили все записи!', { progressBar: true, closeButton: true });
            $scope.submited = false;
        })
    };
	};
});

app.controller('reviewsController', function($scope, $http, $sce) {
    $scope.patientreviews = {};
    $scope.patientreview = [];

    var reviewsdata = [];
    $http.get("/php_backend/index.php?method=reviews").then(function(data) {
        $scope.patientreviews = data.data;
        angular.forEach($scope.patientreviews, function(reviews, reviews_id) {
            angular.forEach(reviews, function(reviewsnote, reviewsnote_id) {
                reviewsdata.push({
                    "id": reviewsnote.id,
                    "name": reviewsnote.name,
                    "area": reviewsnote.area,
                    "text": reviewsnote.text,
                    "inputdatetime": reviewsnote.inputdatetime,
                    "fotoname": reviewsnote.fotoname,
                    "videoname": $sce.trustAsResourceUrl(reviewsnote.videoname),
                });
            });
        });
        $scope.patientreview = reviewsdata;
    });


    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages = function() {
        return Math.ceil($scope.patientreview.length / $scope.pageSize);
    }

});

app.controller('contactsController', function($scope, $http) {

});

app.controller('aboutdoctorController', function($scope, $http) {
	
});

app.controller('listanalyzesController', function($scope, $http, toastr, $filter) {
    $scope.typeswork = {};
    $scope.typesworks = [];
    $scope.forpatient = {};
    $scope.forpatients = [];

    var worksdata = [];
    $http.get("https://gynecologykz.com/php_backend/index.php?method=upload").then(function(data) {
        $scope.typeswork = data.data;
        angular.forEach($scope.typeswork, function(work, work_id) {
            angular.forEach(work, function(worknote, worknote_id) {
                worksdata.push({ "id": worknote.id, "name": worknote.name, "patch": worknote.patch });
            });
        });
        $scope.typesworks = worksdata;
    });
});
