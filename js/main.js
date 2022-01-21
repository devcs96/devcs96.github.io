/* eslint-disable node/no-unsupported-features/node-builtins */
(function($, moment, ClipboardJS, config) {
    $('.article img:not(".not-gallery-item")').each(function() {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<p class="has-text-centered is-size-6 caption">' + this.alt + '</p>');
            }
        }
    });

    if (typeof $.fn.lightGallery === 'function') {
        $('.article').lightGallery({ selector: '.gallery-item' });
    }
    if (typeof $.fn.justifiedGallery === 'function') {
        if ($('.justified-gallery > p > .gallery-item').length) {
            $('.justified-gallery > p > .gallery-item').unwrap();
        }
        $('.justified-gallery').justifiedGallery();
    }

    if (typeof moment === 'function') {
        $('.article-meta time').each(function() {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function() {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('justify-content-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('justify-content-start');
        }
    }
    adjustNavbar();
    $(window).resize(adjustNavbar);

    function toggleFold(codeBlock, isFolded) {
        const $toggle = $(codeBlock).find('.fold i');
        !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
        !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
        !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
    }

    function createFoldButton(fold) {
        return '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
    }

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof config !== 'undefined'
        && typeof config.article !== 'undefined'
        && typeof config.article.highlight !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function() {
            const classes = $(this).attr('class').split(/\s+/);
            if (classes.length === 1) {
                $(this).addClass('hljs-' + classes[0]);
                $(this).removeClass(classes[0]);
            }
        });


        const clipboard = config.article.highlight.clipboard;
        const fold = config.article.highlight.fold.trim();

        $('figure.highlight').each(function() {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level is-mobile');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level is-mobile"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof ClipboardJS !== 'undefined' && clipboard) {
            $('figure.highlight').each(function() {
                const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                const button = '<a href="javascript:;" class="copy" title="Copy" data-clipboard-target="#' + id + ' .code"><i class="fas fa-copy"></i></a>';
                $(this).attr('id', id);
                $(this).find('figcaption div.level-right').append(button);
            });
            new ClipboardJS('.highlight .copy'); // eslint-disable-line no-new
        }

        if (fold) {
            $('figure.highlight').each(function() {
                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        $(this).find('figcaption div.level-left').prepend(createFoldButton('folded'));
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(createFoldButton(fold));
                toggleFold(this, fold === 'folded');
            });

            $('figure.highlight figcaption .fold').click(function() {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    const $toc = $('#toc');
    if ($toc.length > 0) {
        const $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() { // eslint-disable-line no-inner-declarations
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }

    
}(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings));

    // customization of hexo blog - 2021.07.27
    const themeBtn = document.querySelectorAll(".navbar-item")[4]
     const darkTheme = document.querySelector("#dark");
    const head = darkTheme.parentNode
    
    function updateTheme(v){
        if(v=="white"){
           themeBtn.textContent = "☀️"
           head.removeChild(darkTheme);
        }else{
            themeBtn.textContent = "🌙"
            head.appendChild(darkTheme);
        }
    }
    function cookieUtil(f){
        val = document.cookie.split(";")    
        for(let i = 0; i< val.length ; i++){
            [k,v] = val[i].trim().split("=");
            if(k == "theme"){
                return f(v);
            }   
        }
        document.cookie="theme=white; path=/;";
        
        return updateTheme("white");
    }
    function togleTheme(theme){
        if(theme=="dark"){
            document.cookie="theme=white; path=/;"
            updateTheme("white");
        }else{
            document.cookie="theme=dark; path=/;"
            updateTheme("dark");    
        }
    }
    themeBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        if(document.cookie){
            cookieUtil(togleTheme);
        }
    });

    function createSidebar(){
        const subElement = document.getElementsByTagName("h2");
        const mainElement = document.getElementsByTagName('h1');
        const columns = document.querySelector(".columns");
        const mainTitle = mainElement.item(0).innerText;
        wrapper = document.createElement("div");
        main = document.createElement("ul");
        mainTxt = document.createElement("span");
        mainTxt.textContent = mainTitle;
        str = document.createElement("strong");
        str.appendChild(mainTxt);
        main.appendChild(str);
        main.style.position = "fixed";
        main.style.padding = "10px"
        main.style.borderLeft = "5px solid #2196f3";
        main.style.background = "aliceblue";
        wrapper.appendChild(main);
        main.setAttribute("id","main");
        wrapper.classList.add("order-3");
        wrapper.classList.add("column-right");
        wrapper.style.padding="20px"
        subList = [];
        Array.from(subElement).forEach((element)=>{
            let subTxt   = element.children.item(0).getAttribute("title");
            let sub      = document.createElement('li');
            subTxt       = subTxt.replaceAll("-lt-","<");
            subTxt       = subTxt.replaceAll("-gt-",">");
            subTxt       = subTxt.replaceAll("-"," ");
            let subLink  = document.createElement("a");
            subLink.textContent = "- "+subTxt;
            sub.appendChild(subLink);
            main.appendChild(sub);
            subLink.addEventListener("click",function(){
                element.scrollIntoView({behavior: "smooth"});
            })    
            subList.push(sub);
        })        
        columns.appendChild(wrapper);
        document.addEventListener("scroll",function(){
            curr = getRelativeYPos(this.documentElement.scrollTop);      
            Array.from(subElement).forEach((element,index)=>{
                target = getRelativeYPos(element.offsetTop);
                targetTxt = subList[index];
                targetFw = getComputedStyle(targetTxt).fontWeight;
        
                    if(target <= curr && targetFw == '400'){
                        targetTxt.style.fontWeight="900";
                    }else if(target > curr && targetFw == '900'){
                        targetTxt.style.fontWeight="400";
                    }   
            })
            
            // scroll is bottom 
            if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2){
                subList.forEach((element)=>element.style.fontWeight ="900");             
            }
        })

    }

    function getRelativeYPos(input){
        let body = document.body, html = document.documentElement;
        let height = Math.max( body.scrollHeight, body.offsetHeight, 
                            html.clientHeight, html.scrollHeight, html.offsetHeight );
        return (input + window.innerHeight)/height * 100;
    }

    function createTopbar(){
        topSideBar = document.createElement("div");
        topSideBarChild = document.createElement("div");
        topSideBar.setAttribute("id","topSideBar")
        topSideBar.style.position = "fixed";
        topSideBar.style.height = "4px";
        topSideBar.style.width = "100%";
        topSideBar.style.top = "0";
        topSideBar.style.left = "0";
        topSideBar.style.zIndex = "9999";
        topSideBarChild.style.width ="0px";
        topSideBarChild.style.height ="100%";
        topSideBarChild.style.backgroundColor ="orange";
        topSideBar.appendChild(topSideBarChild);
        document.getElementsByTagName("body").item(0).appendChild(topSideBar);
        window.addEventListener("scroll",()=>{
            width = getComputedStyle(topSideBarChild).width;
            numWidth = Number(width.substr(0,width.length-2));
            currScroll = document.documentElement.scrollTop;
            if(currScroll == 0){
                topSideBarChild.style.width = "0%";
            }else{
                topSideBarChild.style.width = getRelativeYPos(currScroll) + "%";
            }
           
        })
    }


    function removeSidebar(){
        dom = document.querySelector("#main");
        if(dom != null || dom != undefined){
            document.querySelector("#main").remove();
        }
    }

    function removeTopbar(){
       dom = document.querySelector("topSideBar");
        if(dom != null || dom != undefined){
            dom.remove();
        }
    }

    function addMoreLocation(){
        let prevArticle =  document.querySelector(".article-nav-prev")
        let nextArticle =  document.querySelector(".article-nav-next")
        if(prevArticle != null){
            prevArticle.setAttribute("href" , prevArticle.getAttribute("href") + "#more");
        }if(nextArticle!=null){
             nextArticle.setAttribute("href",nextArticle.getAttribute("href") + "#more");
        }
      
    }

    function onLoad(){
        document.onreadystatechange = function(){
            if(document.readyState == "complete"){
                createTopbar();
                window.scrollTo(0,0);
                let url = document.URL
                if(url.endsWith("#more")){
                    createSidebar();
                    addMoreLocation();
                   
                    document.querySelector(".column-left").style.display = "none";
                }else if( url.endsWith("categories/")){
                    document.querySelector(".column-left").style.display = "none";
                }
                else{
                    removeSidebar();
                    // removeTopbar();
                }    
            }
        }

    }



    (()=>{
        cookieUtil(updateTheme);
        onLoad();


        (function() {
            var w = window;
            if (w.ChannelIO) {
              return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
            }
            var ch = function() {
              ch.c(arguments);
            };
            ch.q = [];
            ch.c = function(args) {
              ch.q.push(args);
            };
            w.ChannelIO = ch;
            function l() {
              if (w.ChannelIOInitialized) {
                return;
              }
              w.ChannelIOInitialized = true;
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
              s.charset = 'UTF-8';
              var x = document.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s, x);
            }
            if (document.readyState === 'complete') {
              l();
            } else if (window.attachEvent) {
              window.attachEvent('onload', l);
            } else {
              window.addEventListener('DOMContentLoaded', l, false);
              window.addEventListener('load', l, false);
            }
          })();
          ChannelIO('boot', {
            "pluginKey": "165ae109-a620-4d3d-ae0a-ed13960872e9"
          });
        
})();

