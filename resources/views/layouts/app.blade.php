<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Quizz Generator</title>

    <!-- Fonts -->

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700" rel='stylesheet' type='text/css'>

    <!-- Styles -->
    @if(!Auth::user())
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    {{-- <link href="{{ elixir('css/app.css') }}" rel="stylesheet"> --}}
    @endif
    @yield('headContent')
    <style>
        @yield('style')

        body {
            font-family: 'Lato';
        }

        .answerButtons {
            background: #1f6299;
            color: #ffffff;
            z-index:100;
        }
        .answerButtons:hover {
            color:lightgrey;
        }

        .fa-btn {
            margin-right: 6px;
        }

    </style>
</head>
<body id="app-layout">
    <nav class="navbar navbar-default navbar-inverse" style="border-radius:0px">
        <div class="container">
            <div class="navbar-header">

                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <!-- Branding Image -->
                @if(!Auth::user())
                <a class="navbar-brand" href="{{ url('/') }}">
                    Quiz Generator
                </a>
                @else
                    <a class="navbar-brand" href="#/">
                        Quiz Generator
                    </a>
                 @endif
            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <!-- Left Side Of Navbar -->
                <ul class="nav navbar-nav">
                    @if(Auth::user())
                    <li><a href="#/">Home</a></li>
                    <li><a href="#myQuizzes">My quizzes</a></li>
                    <li><a href="#quizCreate">Create quiz</a></li>
                    @endif
                </ul>

                <!-- Right Side Of Navbar -->
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (!Auth::user())
                        <li><a href="{{ url('/login') }}">Login</a></li>
                        <li><a href="{{ url('/register') }}">Register</a></li>
                    @else
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                               {{ Auth::user()->name }} <span class="caret"></span>
                            </a>

                            <ul class="dropdown-menu" role="menu">
                                <li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
                            </ul>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>

    @yield('content')

    <!-- JavaScripts -->
    @if(Auth::user())
    <input type="hidden" id="userName" value="{{Auth::user()->name}}">
    @else
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    @endif


    {{-- <script src="{{ elixir('js/app.js') }}"></script> --}}
</body>
</html>
