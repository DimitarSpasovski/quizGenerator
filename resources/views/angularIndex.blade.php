@extends('layouts.app')
@section('headContent')
    <title>Quiz Generator</title>

    <!-- Concatenated CSS -->

    <link href="dest/lib.css?rev=ce521111498417454cb372b05cbd5f4d" rel="stylesheet">
    <link href="dest/app.css?rev=3eb049bc7ba19180ff1544059fdcc413" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
@endsection
@section('content')
<div ng-app="quizGenerator" ng-cloak class="ng-cloak">
    <div ui-view class="container">

    </div>

<!-- Concatenated libraries -->
    <script src="dest/lib.js?rev=7147198a6b39fb6a658865d2f48236a8"></script>
    <!-- Concatenated application -->
    <script src="dest/src.js?rev=7f265617a5874371c077319a5ac3d24e"></script>
    <!-- All html templates -->
    <script src="dest/templates.js?rev=2e2000313aecd86f2eb18ad0c247584c"></script>
</div>
@endsection
