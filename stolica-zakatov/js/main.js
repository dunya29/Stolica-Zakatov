window.addEventListener("load", () => {
    if (document.querySelector(".preloader")) {
        document.body.classList.remove("no-scroll")
        disableScroll()
        document.querySelectorAll(".preloader__logo path").forEach(item => {
            let pathLength = Math.ceil(item.getTotalLength())
            item.style.strokeDasharray = pathLength + "px";
            item.style.strokeDashoffset = pathLength
            setTimeout(() => {
                item.parentNode.classList.add("startAnim")
            }, 0);
        })
        let i = 0
        let interval = setInterval(() => {
            document.querySelector(".preloader__percent").textContent = i + '%'
            i++
            if (i === 101) {
                clearInterval(interval)
                setTimeout(() => {
                    document.querySelector(".preloader__bar").classList.add("startAnim")
                    setTimeout(() => {
                        document.querySelector(".preloader").classList.add("startAnim")
                        setTimeout(() => {
                            document.body.classList.add("loaded")
                            enableScroll()
                            ScrollTrigger.refresh()
                        }, 600);
                    }, 700);
                }, 500);
            }
        }, 7);
    }
    //equalizer
    const equalizer = document.querySelector(".equalizer")
    if (equalizer) {
        gsap.to(equalizer, {
            ease: "none",
            scrollTrigger: {
                trigger: equalizer,
                pin: true,
                pinSpacing: false,
                scrub: 1,
                start: "top top",
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        })
    }
    //partners
    const partners = document.querySelector(".partners")
    const partnersSticky = document.querySelector(".partners__sticky")
    const partnersItems = document.querySelectorAll(".partners__item")
    if (partnersSticky && partnersItems.length) {
        function offsetTop() {
            let top
            if (window.innerWidth > bp.tablet) {
                top = (window.innerHeight - partnersSticky.clientHeight) / 2 > 0 ? (window.innerHeight - partnersSticky.clientHeight) / 2 : 0
            } else {
                top = header.clientHeight + 10
            }
            return top
        }
        let slideCount = partnersItems.length
        partnersItems.forEach((item, idx) => {
            gsap.to(item, {
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    start: () => "top top+=" + offsetTop(),
                    end: () => "+=" + (item.offsetHeight * (slideCount - (window.innerWidth > bp.tablet ? 2 : 1) - idx)),
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            })
        })
        gsap.matchMedia().add("(min-width: 767.98px)", () => {
            gsap.to(partnersSticky, {
                ease: "none",
                scrollTrigger: {
                    trigger: partnersSticky,
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    start: () => "top top+=" + offsetTop(),
                    end: () => "+=" + (partners.offsetHeight / slideCount * (slideCount - 2)),
                    onEnterBack: () => header.classList.add("hidden"),
                    onLeaveBack: () => header.classList.remove("hidden"),
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            })
        })

    }
    //history
    const mainHistory = document.querySelector(".main-history")
    if (mainHistory) {
        gsap.to(mainHistory, {
            ease: "none",
            scrollTrigger: {
                trigger: mainHistory,
                start: "top center",
                onEnter: () => {
                    if (!mainHistory.classList.contains('show')) {
                        mainHistory.classList.add('show')
                    }
                },
                invalidateOnRefresh: true,
            }
        })
    }
})
const header = document.querySelector(".header")
const iconMenu = document.querySelector('.icon-menu');
const modal = document.querySelectorAll(".modal")
const modOpenBtn = document.querySelectorAll(".mod-open-btn")
const successModal = document.querySelector(".success-mod")
const errorModal = document.querySelector(".error-mod")
let animSpd = 400
let bp = {
    largeDesktop: 1440.98,
    desktop: 1278.98,
    laptop: 1050.98,
    tablet: 767.98,
    phone: 600.98
}
//get path to sprite id
function sprite(id) {
    return '<svg><use xlink:href="img/svg/sprite.svg#' + id + '"></use></svg>'
}
//scroll pos
function scrollPos() {
    return window.pageYOffset || document.documentElement.scrollTop
}
//enable scroll
function enableScroll() {
    if (!document.querySelector(".modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");
    }
}
//smoothdrop
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `height ${animDur}ms ease`;
    body.style['-webkit-transition'] = `height ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        let height = body.clientHeight + 'px';
        body.style.height = height
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
            }, animDur);
        }, 0);
    }
}
//tabSwitch
function tabSwitch(nav, block) {
    nav.forEach(item => {
        item.addEventListener("click", () => {
            nav.forEach(el => {
                el.classList.remove("active")
                el.setAttribute("aria-selected", false)
            })
            item.classList.add("active")
            item.setAttribute("aria-selected", true)
            block.forEach(el => {
                if (el.dataset.block === item.dataset.tab) {
                    if (!el.classList.contains("active")) {
                        el.classList.add("active")
                        el.style.opacity = "0"
                        setTimeout(() => {
                            el.style.opacity = "1"
                        }, 0);
                    }
                } else {
                    el.classList.remove("active")
                }
            })
        })
    });
}
// custom scroll FF
const customScroll = document.querySelectorAll(".custom-scroll")
let isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) {
    document.documentElement.style.scrollbarColor = "#ba0060 #f8e5ef"
}
if (isFirefox && customScroll) {
    customScroll.forEach(item => { item.style.scrollbarColor = "#ba0060 #f8e5ef" })
}
//anchor
const anchorLinks = document.querySelectorAll(".js-anchor")
if (anchorLinks.length) {
    document.querySelectorAll(".js-anchor").forEach(item => {
        item.addEventListener("click", e => {
            let idx = item.getAttribute("href").indexOf("#")
            const href = item.getAttribute("href").substring(idx)
            let dest = document.querySelector(href)
            if (dest) {
                e.preventDefault()
                let destPos = dest.getBoundingClientRect().top < 0 ? dest.getBoundingClientRect().top - header.clientHeight - 10 : dest.getBoundingClientRect().top - 10
                if (iconMenu.classList.contains("active")) {
                    iconMenu.click()
                    setTimeout(() => {
                        window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                    }, 300);
                } else {
                    window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                }
            }
        })
    })
}
//fixed header
let lastScroll = scrollPos();
window.addEventListener("scroll", () => {
    if (scrollPos() > 1) {
        header.classList.remove("no-scroll")
        header.classList.add("scroll")
        if ((scrollPos() > lastScroll && !header.classList.contains("unshow"))) {
            header.classList.add("unshow")
        } else if (scrollPos() < lastScroll && header.classList.contains("unshow")) {
            header.classList.remove("unshow")
        }
    } else {
        header.classList.remove("scroll", "unshow")
        header.classList.add("no-scroll")
    }
    lastScroll = scrollPos()
})
//switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block")
if (switchBlock) {
    switchBlock.forEach(item => {
        tabSwitch(item.querySelectorAll("[data-tab]"), item.querySelectorAll("[data-block]"))
    })
}
//open modal
function openModal(modal) {
    let activeModal = document.querySelector(".modal.open")
    disableScroll()
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    if (modal.querySelector("video")) {
        modal.querySelectorAll("video").forEach(item => item.pause())
    }
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    setTimeout(() => {
        viewportMeta.content = "width=device-width, initial-scale=1";
    }, 100);
    modal.classList.remove("open")
    setTimeout(() => {
        enableScroll()
    }, animSpd);
}
// modal click outside
if (modal) {
    modal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".modal__content").contains(e.target)) {
                closeModal(mod);
            }
        });
        mod.querySelectorAll(".modal__close").forEach(btn => {
            btn.addEventListener("click", () => {
                closeModal(mod)
            })
        })
    });
}
// modal button on click
if (modOpenBtn) {
    modOpenBtn.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault()
            let href = btn.getAttribute("data-modal")
            openModal(document.getElementById(href))
        })
    })
}
// custom fancybox
function initfancyModal(fancyItem) {
    let mediaSrc = []
    let objectFit = fancyItem.getAttribute("data-fit") ? fancyItem.getAttribute("data-fit") : "media-contain"
    let val = fancyItem.getAttribute("data-fancy")
    let thumb = fancyItem.hasAttribute("data-thumb")
    document.querySelectorAll("[data-fancy]").forEach(el => {
        if (!el.closest(".swiper-slide-duplicate") && el.getAttribute("data-fancy") === val) {
            let obj = {
                src: el.getAttribute("data-src"),
                type: el.getAttribute("data-type") || 'image',
                caption: el.getAttribute("data-caption") || ''
            }
            if (el.getAttribute("data-type") === 'video' && el.getAttribute("data-poster")) {
                obj.poster = el.getAttribute("data-poster")
            }
            mediaSrc.push(obj)
        }
    })
    let initialSl = mediaSrc.findIndex(el => el.src === fancyItem.getAttribute("data-src"))
    document.querySelector(".footer").insertAdjacentHTML('afterend', `
                <div class="custom-scroll modal fancy-modal ${val + '-modal'}">
                    <div class="fancy-modal__content">
                        <button type="button" class="btn-cross modal__close"></button>
                        <div class="modal__top">
                            <h2>${mediaSrc[initialSl].caption}</h2>
                        </div>
                        <div class="fancy-modal__mainswiper">
                            <div class="swiper">
                                <div class="swiper-wrapper">
                                    ${mediaSrc.map((el, i) => `<div class="swiper-slide">
                                        <div class="${objectFit}">
                                            ${el.type === 'video' ? `<video ${i === initialSl ? `src='${el.src}'` : `data-src='${el.src}'`} ${el.poster ? `poster='${el.poster}'` : ''} loop autoplay playsinline mute controls></video>` : `<img src=${el.src} alt="">`}                                                
                                        </div>
                                    </div>`).join("")}
                                </div>
                            </div>
                            <div class="nav-btns">
                                <button type="button" class="nav-btn nav-btn--prev">${sprite('btn-prev')}</button>
                                <button type="button" class="nav-btn nav-btn--next">${sprite('btn-next')}</button>
                            </div>
                        </div>
                        ${thumb && mediaSrc.length > 1 ? `<div class="fancy-modal__thumbswiper">
                            <div class="swiper">
                                <div class="swiper-wrapper">
                                    ${mediaSrc.map(el => `<div class="swiper-slide">
                                        <div class="${objectFit} ${el.type === 'video' ? 'video' : ''}">
                                            ${el.type === 'video' ? `<img ${el.poster ? `src='${el.poster}'` : ''}>` : `<img src=${el.src} alt="">`}                                                
                                        </div>
                                    </div>`).join("")}
                                </div>
                            </div>
                        </div>` : ""}
                    </div>
                </div>
            `);
    const fancyModal = document.querySelector(".fancy-modal")
    let fancyThumbSwiper
    if (thumb && mediaSrc.length > 1) {
        fancyThumbSwiper = new Swiper(fancyModal.querySelector(".fancy-modal__thumbswiper .swiper"), {
            slidesPerView: 3,
            spaceBetween: 12,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            initialSlide: initialSl,
            navigation: {
                prevEl: fancyModal.querySelector(".nav-btn--prev"),
                nextEl: fancyModal.querySelector(".nav-btn--next"),
            },
            breakpoints: {
                575.98: {
                    slidesPerView: 4,
                }
            },
            speed: 800
        })
    }
    let fancyMainSwiper = new Swiper(fancyModal.querySelector(".fancy-modal__mainswiper .swiper"), {
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        initialSlide: initialSl,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        thumbs: {
            swiper: fancyThumbSwiper || null,
        },
        navigation: {
            prevEl: fancyModal.querySelector(".nav-btn--prev"),
            nextEl: fancyModal.querySelector(".nav-btn--next"),
        },
        speed: 300,
    })
    fancyMainSwiper.on("slideChange", e => {
        fancyModal.querySelector(".modal__top h2").textContent = mediaSrc[fancyMainSwiper.activeIndex].caption
        if (fancyModal.querySelector("video")) {
            fancyModal.querySelectorAll("video").forEach(item => item.pause())
        }
        let lazyEl = fancyMainSwiper.slides[fancyMainSwiper.activeIndex].querySelector('[data-src]');
        let videoEl = fancyMainSwiper.slides[fancyMainSwiper.activeIndex].querySelector('video');
        if (lazyEl) {
            lazyEl.setAttribute("src", lazyEl.getAttribute("data-src"))
            lazyEl.removeAttribute("data-src")
        } else if (!lazyEl && videoEl) {
            videoEl.play()
        }
    })
    openModal(fancyModal)
    fancyModal.querySelectorAll(".modal__close").forEach(btn => {
        btn.addEventListener("click", e => {
            closeModal(fancyModal)
            setTimeout(() => {
                fancyModal.remove()
            }, animSpd);
        })
    })
}
const fancyBlock = document.querySelectorAll(".fancy-block")
if (fancyBlock.length) {
    fancyBlock.forEach(block => {
        block.addEventListener("click", e => {
            const fancyItems = block.querySelectorAll("[data-fancy]")
            if (fancyItems.length) {
                fancyItems.forEach(fancyItem => {
                    if (fancyItem.contains(e.target)) {
                        initfancyModal(fancyItem)
                    }
                })
            }
        })
    });
}
//setSuccessTxt
function setSuccessTxt(title = false, txt = false, btnTxt = false) {
    successModal.querySelector("h2").textContent = title ? title : "Ваша заявка принята"
    successModal.querySelector(".main-btn span").textContent = btnTxt ? btnTxt : "Закрыть"
    successModal.querySelector("p").textContent = txt ? txt : ''
}
//setErrorTxt
function setErrorTxt(title = false, txt = false, btnTxt = false) {
    errorModal.querySelector("h2").textContent = title ? title : "Ошибка"
    errorModal.querySelector(".main-btn span").textContent = btnTxt ? btnTxt : "Закрыть"
    errorModal.querySelector("p").textContent = txt ? txt : ''
}
// openSuccessMod
function openSuccessMod(title = false, txt = false, btnTxt = false) {
    setSuccessTxt(title, txt, btnTxt)
    openModal(successModal)
}
// openErrorMod
function openErrorMod(title = false, txt = false, btnTxt = false) {
    setErrorTxt(title, txt, btnTxt)
    openModal(errorModal)
}
// formReset
function formReset(form) {
    if (form.querySelectorAll(".item-form").length > 0) {
        form.querySelectorAll(".item-form").forEach(item => item.classList.remove("error"))
    }
    if (form.querySelectorAll("[data-error]").length > 0) {
        form.querySelectorAll("[data-error]").forEach(item => item.textContent = '')
    }
    form.querySelectorAll("input").forEach(inp => {
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
        if (["checkbox", "radio"].includes(inp.type) && !inp.classList.contains("required")) {
            inp.checked = false
        }
    })
    if (form.querySelector("textarea")) {
        form.querySelector("textarea").value = ""
    }
    if (form.querySelector(".file-form__items")) {
        form.querySelector(".file-form__items").innerHTML = ""
    }
}
//file-form
let allFileTypes = [
    { "extension": ".png", "mimeType": "image/png" },
    { "extension": [".jpg", ".jpeg"], "mimeType": "image/jpeg" },
    { "extension": ".gif", "mimeType": "image/gif" },
    { "extension": ".bmp", "mimeType": "image/bmp" },
    { "extension": ".txt", "mimeType": "text/plain" },
    { "extension": ".rtf", "mimeType": "application/rtf" },
    { "extension": [".ppt", ".pot", ".pps", ".ppa"], "mimeType": "application/vnd.ms-powerpoint" },
    { "extension": ".pptx", "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { "extension": ".odp", "mimeType": "application/vnd.oasis.opendocument.presentation" },
    { "extension": ".ods", "mimeType": "application/vnd.oasis.opendocument.spreadsheet" },
    { "extension": ".doc", "mimeType": "application/msword" },
    { "extension": ".docx", "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { "extension": ".pdf", "mimeType": "application/pdf" },
    { "extension": [".xls", ".xlt", ".xla", ".xlsb", ".xlsm", ".xltx", ".xltm"], "mimeType": "application/vnd.ms-excel" },
    { "extension": ".xlsx", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { "extension": ".odt", "mimeType": "application/vnd.oasis.opendocument.text" }
]
function addFile(files, item) {
    let maxSize = item.querySelector('input').getAttribute("data-max-size")
    let accept = item.querySelector('input').getAttribute("accept")
    let fileTypes = []
    if (accept) {
        let acceptArr = accept.split(",").map(item => item.trim().toLowerCase()).filter(item => item !== "");
        allFileTypes.forEach(type => {
            if (Array.isArray(type.extension)) {
                for (const ext of type.extension) {
                    if (acceptArr.includes(ext)) {
                        fileTypes.push(type.mimeType);
                        break;
                    }
                }
            } else if (typeof type.extension === 'string') {
                if (acceptArr.includes(type.extension)) {
                    fileTypes.push(type.mimeType);
                }
            }
        })
        accept = acceptArr.map(item => item.replace(/^\./, '')).join(", ")
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Файл должен быть менее ${maxSize} МБ`
            return
        } else if (accept && fileTypes.length && !fileTypes.includes(file.type)) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Разрешённые форматы: ${accept}`
            return
        } else {
            item.classList.remove("error")
            item.querySelector("[data-error]").textContent = ""
            let reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = () => {
                item.querySelector(".file-form__items").insertAdjacentHTML("afterbegin", `<div class="file-form__item">
                        <div class="file-form__name">${file.name}</div>
                        <button class="btn-cross file-form__del"></button>
                    </div>`)
            }
            reader.onerror = () => {
                console.log(reader.error);
            }
        }
    }
}
if (document.querySelector(".file-form")) {
    document.querySelectorAll(".file-form").forEach(item => {
        item.querySelector("input").addEventListener("change", e => {
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            let files = e.target.files;
            addFile(files, item)
        })
        //delete file
        item.addEventListener("click", e => {
            item.querySelectorAll(".file-form__del").forEach((del, idx) => {
                if (del.contains(e.target)) {
                    const dt = new DataTransfer()
                    const input = item.querySelector("input")
                    const { files } = input
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i]
                        if (i !== idx) {
                            dt.items.add(file)
                        }
                    }
                    input.files = dt.files
                    setTimeout(() => {
                        del.parentNode.remove()
                    }, 0);
                }
            })
        })
        item.addEventListener("dragenter", e => {
            e.preventDefault();
        })
        item.addEventListener("dragover", e => {
            e.preventDefault();
        })
        item.addEventListener("dragleave", e => {
            e.preventDefault();
        })
        item.addEventListener("drop", function (e) {
            e.preventDefault();
            const dt = new DataTransfer()
            dt.items.add(e.dataTransfer.files[0])
            let files = Array.from(dt.files)
            item.querySelector("input").files = dt.files
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            addFile(files, item)
        });
    })
}
//accordion
const accordion = document.querySelectorAll(".accordion")
if (accordion.length) {
    accordion.forEach(item => {
        item.querySelector(".accordion__header").addEventListener("click", () => {
            if (!item.classList.contains("no-close")) {
                item.parentNode.parentNode.querySelectorAll(".accordion").forEach(el => {
                    if (el.querySelector(".accordion__header").classList.contains("active")) {
                        smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
                        if (el.getBoundingClientRect().top < 0) {
                            let pos = scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                            window.scrollTo(0, pos)
                        }
                    }
                })
            }
            smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
        })
    })
}
//share
const shareList = document.querySelectorAll(".share [data-share]")
if (shareList) {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(document.title)
    let linkMass = [
        {
            value: 'vk',
            href: "https://vk.com/share.php?url=" + url + "&title=" + title
        },
        {
            value: 'telegram',
            href: "https://t.me/share/url?url=" + url + '&text=' + title
        },
        {
            value: 'viber',
            href: "viber://forward?text=" + url
        },
        {
            value: 'odnoklassniki',
            href: "https://connect.ok.ru/offer?url=" + url + "&title=" + title
        },
    ]
    shareList.forEach(item => {
        let attr = item.getAttribute("data-share")
        linkMass.forEach(obj => {
            if (obj.value === attr.toLowerCase()) {
                item.setAttribute("href", obj.href)
            }
        })

    })
}
// share with page
const shareLink = document.querySelector(".share__link")
let shareTimeout
if (shareLink) {
    shareLink.addEventListener("click", e => {
        e.preventDefault();
        clearTimeout(shareTimeout)
        let inp = document.createElement("input");
        document.body.append(inp)
        inp.value = window.location.href
        inp.select()
        document.execCommand("copy")
        inp.remove()
        shareLink.classList.add("coppied")
        shareTimeout = setTimeout(() => {
            shareLink.classList.remove("coppied")
        }, 1500);
    })
}
//scroll indicator
const scrollIndicator = document.querySelector(".scroll-indicator")
if (scrollIndicator) {
    window.addEventListener("scroll", () => {
        scrollIndicator.style.width = (scrollPos() * 100 / (document.body.scrollHeight - window.innerHeight)) + "%"
    })
}
// fixed btn
const fixedBtn = document.querySelector(".fixed-btn")
function fixedBtnVisibility() {
    if (scrollPos() > window.innerHeight && scrollPos() + window.innerHeight + 150 < document.body.scrollHeight) {
        fixedBtn.classList.add("show")
        fixedBtn.style.marginRight = (document.documentElement.clientWidth - window.innerWidth) / 2 + 'px'
    } else {
        fixedBtn.classList.remove("show")
    }
}
if (fixedBtn) {
    fixedBtnVisibility()
    window.addEventListener("scroll", fixedBtnVisibility)
}
//mobile menu
if (iconMenu) {
    iconMenu.addEventListener("click", () => {
        if (!iconMenu.classList.contains("active")) {
            header.classList.add("show-mobMenu")
            iconMenu.classList.add("active")
            iconMenu.setAttribute("aria-label", "Закрыть меню")
            disableScroll()
        } else {
            header.classList.remove("show-mobMenu")
            iconMenu.classList.remove("active")
            iconMenu.setAttribute("aria-label", "Открыть меню")
            enableScroll()
        }
        window.addEventListener("resize", () => {
            if (window.innerWidth > bp.tablet && header.classList.contains("show-mobMenu")) {
                iconMenu.click()
            }
        })
        //mobile header
        const mobileMenu = document.querySelector(".mobile-menu")
        if (mobileMenu) {
            mobileMenu.addEventListener("click", e => {
                if (!mobileMenu.querySelector(".mobile-menu__inner").contains(e.target)) {
                    iconMenu.click()
                }
            })
        }
    })
}
//headliners
const headliners = document.querySelector('.headliners')
if (headliners) {
    let swiper = new Swiper(headliners.querySelector(".swiper"), {
        slidesPerView: 1.47,
        observer: true,
        observeParents: true,
        grabCursor: true,
        centeredSlides: true,
        watchSlidesProgress: true,
        effect: 'coverflow',
        slideToClickedSlide: true,
        initialSlide: headliners.querySelectorAll('.swiper-slide').length > 2 ? 2 : 0,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 400,
            modifier: 1,
            slideShadows: true
        },
        breakpoints: {
            1050.98: {
                slidesPerView: 3.55
            },
            767.98: {
                slidesPerView: 2.95
            },
            479.98: {
                slidesPerView: 2.45,
            }
        },
        scrollbar: {
            el: headliners.querySelector(".swiper-scrollbar"),
            draggable: true,
        },
        autoplay: {
            delay: 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
        },
        speed: 1000,
    })
}
//about
const about = document.querySelector(".about")
if (about) {
    let timeOut
    let swiper1 = new Swiper(about.querySelector(".about__swiper1"), {
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        watchSlidesProgress: true,
        allowTouchMove: false,
        speed: 1000,
    })
    let swiper3 = new Swiper(about.querySelector(".about__swiper3"), {
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        watchSlidesProgress: true,
        allowTouchMove: false,
        speed: 1000,
    })
    let swiper2 = new Swiper(about.querySelector(".about__swiper2"), {
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        watchSlidesProgress: true,
        allowTouchMove: false,
        scrollbar: {
            el: about.querySelector(".swiper-scrollbar"),
            draggable: true,
        },
        autoplay: {
            delay: 3500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
        },
        speed: 1000,
    })
    swiper2.on("slideChange", () => {
        clearTimeout(timeOut)
        swiper1.slideTo(swiper2.activeIndex)
        timeOut = setTimeout(() => {
            swiper3.slideTo(swiper2.activeIndex)
        }, 800);
    })
}
//projects
const projects = document.querySelector(".projects")
const projectCols = document.querySelector(".projects__cols")
if (projects && projects.querySelector('.swiper')) {
    let imageswiper = new Swiper(".projects__imageswiper", {
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        parallax: true,
        navigation: {
            nextEl: projects.querySelector(".nav-btn--next"),
            prevEl: projects.querySelector(".nav-btn--prev")
        },
        scrollbar: {
            el: projects.querySelector(".swiper-scrollbar"),
            draggable: true,
        },
        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
        },
        speed: 1000,
    })
    let contentswiper = new Swiper(".projects__contentswiper", {
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        allowTouchMove: false,
        speed: 1000
    })
    imageswiper.on("slideChange", () => {
        contentswiper.slideTo(imageswiper.activeIndex)
    })
    if (projectCols && projects.querySelector(".nav-btn")) {
        projectCols.addEventListener("mousemove", e => {
            let projectColsLeft = projectCols.getBoundingClientRect().left
            let quarter = projectCols.clientWidth / 4
            if (e.clientX - projectColsLeft < quarter) {
                projects.querySelector(".nav-btn--prev").classList.add("show")
            } else {
                projects.querySelector(".nav-btn--prev").classList.remove("show")
            }
            if (window.innerWidth - e.clientX < quarter) {
                projects.querySelector(".nav-btn--next").classList.add("show")
            } else {
                projects.querySelector(".nav-btn--next").classList.remove("show")
            }
        })
        projectCols.addEventListener("mouseleave", () => {
            projects.querySelector(".nav-btn--prev").classList.remove("show")
            projects.querySelector(".nav-btn--next").classList.remove("show")
        })
    }
}
//schedule
const schedule = document.querySelector(".schedule")
const scheduleFilter = document.querySelector(".schedule-filter")
const filterSelected = document.querySelector(".filter-selected__items")
let filterObj
if (schedule) {
    filterObj = {
        checkInp: function (inp) {
            inp.checked = true
            inp.setAttribute("checked", true)
        },
        uncheckInp: function (inp) {
            inp.checked = false
            inp.removeAttribute("checked")
        },
        setSelected: function (inp) {
            let txt = inp.parentNode.querySelector("span:last-child").textContent
            let idx = inp.getAttribute("data-id")
            let inpName = inp.getAttribute("data-name")
            let selectedTxt = inpName ? inpName + " " + txt.toLowerCase() : txt
            filterSelected.insertAdjacentHTML("afterbegin", `<li data-target="${idx}">${selectedTxt}<button class="btn-cross"></button></li>`)
        },
        removeSelected: function (id) {
            if (filterSelected.querySelector(`[data-target="${id}"]`)) {
                filterSelected.querySelector(`[data-target="${id}"]`).remove()
            }
        },
        selectedOnClick: function (e) {
            filterSelected.querySelectorAll("li").forEach(item => {
                if (item.querySelector(".btn-cross").contains(e.target)) {
                    let dataTarget = item.getAttribute("data-target")
                    // this.uncheckInp(scheduleFilter.querySelector(`label input[data-id='${dataTarget}']`))
                    scheduleFilter.querySelector(`label input[data-id='${dataTarget}']`).click()
                    // item.remove()
                }
            })
        }
    }
    scheduleFilter.addEventListener("click", e => {
        if (scheduleFilter.querySelector("[data-schedule-tab]")) {
            scheduleFilter.querySelectorAll("[data-schedule-tab]").forEach(tab => {
                if (tab.contains(e.target)) {
                    schedule.querySelectorAll("[data-schedule-tab]").forEach(item => {
                        item.classList.remove("active")
                        item.setAttribute("aria-selected", false)
                    })
                    tab.classList.add("active")
                    tab.setAttribute("aria-selected", true)
                    let attr = tab.getAttribute("data-schedule-tab")
                    let activeBlock = schedule.querySelector(`[data-schedule-block='${attr}']`)
                    if (activeBlock) {
                        schedule.querySelectorAll("[data-schedule-block").forEach(item => item.classList.remove("active"))
                        activeBlock.classList.add("active")
                        activeBlock.style.opacity = "0"
                        setTimeout(() => {
                            activeBlock.style.opacity = "1"
                        }, 0);
                    }
                }
            })
        }
        if (scheduleFilter.querySelector("label input")) {
            scheduleFilter.querySelectorAll("label input").forEach(inp => {
                if (inp.contains(e.target)) {
                    let id = inp.getAttribute("data-id")
                    if (inp.type === 'checkbox') {
                        inp.checked ? filterObj.setSelected(inp) : filterObj.removeSelected(id)
                    } else if (inp.type === 'radio') {
                        scheduleFilter.querySelectorAll(`input[name='${inp.name}']`).forEach(inp => filterObj.removeSelected(inp.getAttribute("data-id")))
                        scheduleFilter.setSelected(inp)
                    }
                }
            })
        }
        if (window.innerWidth <= bp.laptop && e.target.classList.contains("schedule-filter__lbl") && e.target.nextElementSibling.classList.contains("modal")) {
            openModal(e.target.nextElementSibling)
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth > bp.laptop && scheduleFilter.querySelector(".modal.open")) {
                closeModal(scheduleFilter.querySelector(".modal.open"))
            }
        })
    })
    filterSelected.addEventListener("click", e => filterObj.selectedOnClick(e))
}
//matter setup
const Sc = (e, t) => Math.random() * (t - e) + e;
class MatterClass {
    constructor(e) {
        this.container = e.container,
            this.elements = [...e.elements],
            this.restitution = e.restitution || .4,
            this.gravity = e.gravity || .2,
            this.interactCallback = e.interactCallback || null,
            this.updateCallback = e.updateCallback || null,
            this.triggerSelector = e.triggerSelector || null,
            this.element = this.container,
            this.width = this.element.getBoundingClientRect().width,
            this.height = this.element.getBoundingClientRect().height,
            this.engine = Matter.Engine.create({
                gravity: {
                    y: this.gravity
                }
            }),
            this.world = this.engine.world,
            this.render = Matter.Render.create({
                element: this.element,
                engine: this.engine,
                options: {
                    width: this.width,
                    height: this.height,
                    wireframes: !1,
                    background: "transparent"
                }
            }),
            this.setupMouse(),
            this.addWalls(),
            Matter.Render.run(this.render),
            this.runner = Matter.Runner.create(),
            Matter.Runner.run(this.runner, this.engine),
            this.addElements(),
            this.updateBodies()
    }
    addElements() {
        if (!Array.isArray(this.elements))
            return void console.error("Elements should be an array.");
        const e = this.elements.map((e => {
            const t = e.getBoundingClientRect()
                , minSide = Math.min(e.clientWidth, e.clientHeight)
                , maxRadius = minSide / 2
                , n = Math.min(parseFloat(window.getComputedStyle(e).borderRadius), maxRadius)
                , r = Matter.Bodies.rectangle(-200, -200, t.width, t.height, {
                    isStatic: !1,
                    restitution: this.restitution,
                    label: e.getAttribute("data-target"),
                    render: {
                        fillStyle: "transparent",
                        strokeStyle: "transparent"
                    },
                    chamfer: {
                        radius: n
                    }
                });
            return Matter.Events.on(this.runner, null === this.triggerSelector || void 0 === this.triggerSelector ? "beforeUpdate" : "tick", (() => {
                e.style.top = `${r.position.y}px`,
                    e.style.left = `${r.position.x}px`,
                    e.style.transform = `translate(-50%, -50%) rotate(${r.angle}rad)`
            }
            )),
                r
        }
        ));
        Matter.Composite.add(this.world, e)
    }
    addWalls() {
        const e = {
            label: "wall",
            isStatic: !0,
            render: {
                fillStyle: "transparent",
                strokeStyle: "transparent"
            }
        }
            , t = [Matter.Bodies.rectangle(0, -150, 2 * this.width, 300, e), Matter.Bodies.rectangle(0, this.height + 25, 2 * this.width, 60, e), Matter.Bodies.rectangle(-150, 0, 300, 2 * this.height, e), Matter.Bodies.rectangle(this.width + 150, 0, 300, 2 * this.height, e)];
        Matter.Composite.add(this.world, [...t])
    }
    setupMouse() {
        const e = Matter.Mouse.create(this.render.canvas)
            , t = Matter.MouseConstraint.create(this.engine, {
                mouse: e,
                constraint: {
                    stiffness: .1,
                    render: {
                        visible: !1
                    }
                }
            });
        Matter.Composite.add(this.world, t),
            this.render.mouse = e,
            e.element.removeEventListener("mousewheel", e.mousewheel),
            e.element.removeEventListener("DOMMouseScroll", e.mousewheel),
            this.interactCallback && this.interactCallback(t)
    }
    updateBodies() {
        if (null === this.triggerSelector || void 0 === this.triggerSelector) {
            const e = Matter.Composite.allBodies(this.engine.world)
                , t = "wall"
                , n = this.height
                , r = this.width - 10;
            let i = 0;
            const o = setInterval((() => {
                i++,
                    e[i]?.label !== t && e[i] && (Matter.Body.setStatic(e[i], !1),
                        Matter.Body.setPosition(e[i], {
                            x: Sc(0, r),
                            y: 0
                        }),
                        Matter.Body.setVelocity(e[i], {
                            x: Sc(0, 10),
                            y: Sc(0, 5)
                        }),
                        e[i].position.y > n && Matter.Body.setPosition(e[i], {
                            x: Sc(0, r),
                            y: 0
                        })),
                    i === e.length && clearInterval(o)
            }
            ), 100)
        } else
            ml.create({
                trigger: this.triggerSelector,
                once: !0,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => {
                    const e = Matter.Composite.allBodies(this.engine.world)
                        , t = Math.floor(this.width);
                    let n = 1;
                    const r = setInterval((() => {
                        n += 1;
                        const i = Sc(0, t - 50)
                            , o = e[n];
                        if ("wall" !== o?.label && o) {
                            Matter.Body.setStatic(o, !1),
                                Matter.Body.setPosition(o, {
                                    x: i,
                                    y: 0
                                }),
                                Matter.Body.setVelocity(o, {
                                    x: Sc(0, 10),
                                    y: Sc(0, 5)
                                });
                            const e = o.bounds.max.x - o.bounds.min.x;
                            o.position.x < e ? Matter.Body.setPosition(o, {
                                x: e,
                                y: o.position.y
                            }) : o.position.x > this.width - e && Matter.Body.setPosition(o, {
                                x: this.width - e,
                                y: o.position.y
                            })
                        }
                        n === e.length && clearInterval(r)
                    }
                    ), 100)
                }
            })
    }
}
const jsMatter = document.querySelectorAll(".js-matter")
if (jsMatter.length) {
    jsMatter.forEach(item => {
        let matterInterval
        let scrollListener;
        let resizeListener;
        function matterAnimInit(item) {
            let itemTop = item.getBoundingClientRect().top
            let top = scrollPos() + itemTop
            let itemPoint = Math.abs(window.innerHeight - item.offsetHeight * 0.5);
            if (itemTop > 0 && (scrollPos() > top - itemPoint) && !item.classList.contains("animated")) {
                new MatterClass({
                    container: item,
                    elements: item.querySelectorAll(".js-matter__item"),
                })
                item.classList.add("animated")
                window.removeEventListener("scroll", scrollListener);
                window.removeEventListener("resize", resizeListener)
            }
        }
        const init = () => matterAnimInit(item);
        scrollListener = () => init();
        resizeListener = () => init();
        window.addEventListener("scroll", scrollListener);
        window.addEventListener("resize", resizeListener);
        init();
        window.addEventListener("wheel", () => {
            clearInterval(matterInterval)
            item.style.pointerEvents = "none"
            matterInterval = setInterval(() => {
                item.style.pointerEvents = null
            }, 100);
        });
    })
}
// fadeUp animation
function animate() {
    if (document.querySelectorAll('[data-animation]').length) {
        document.querySelectorAll('[data-animation]').forEach(item => {
            let itemTop = item.getBoundingClientRect().top + scrollPos();
            let itemPoint = Math.abs(window.innerHeight - item.offsetHeight * 0.1);
            if (scrollPos() > itemTop - itemPoint) {
                let animName = item.getAttribute("data-animation")
                item.classList.add(animName);
            }
        })
    }

}
animate()
window.addEventListener("scroll", animate)
//map
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}
const map = document.querySelector(".map")
const itemMap = document.querySelectorAll(".item-map")
const mapModal = document.querySelector(".map-modal")
const mapModalMob = document.querySelector(".mapMobile-modal")
const mapBtn = document.querySelector(".map__btn")
function setMap(item) {
    if (item.querySelector("[data-src]")) {
        item.querySelectorAll("[data-src]").forEach(item => {
            let src = item.getAttribute("data-src")
            item.setAttribute("src", src)
            item.removeAttribute("data-src")
        })
    }
    if (item.querySelector("[data-srcset]")) {
        item.querySelectorAll("[data-srcset]").forEach(item => {
            let srcset = item.getAttribute("data-srcset")
            item.setAttribute("srcset", srcset)
            item.removeAttribute("data-srcset")
        })
    }
    let preview = item.querySelector("[data-zoom]") ? item.querySelector("[data-zoom]").innerHTML : ''
    let link = item.getAttribute("data-link") || ''
    let direction = item.querySelector("[data-direction]") ? item.querySelector("[data-direction]").textContent : ''
    let title = item.querySelector("[data-title]") ? item.querySelector("[data-title]").textContent : ''
    if (mapModal.querySelector(".map-modal__preview")) {
        mapModal.querySelector(".map-modal__preview").innerHTML = preview
    }
    if (mapModal.querySelector(".map-modal__link")) {
        mapModal.querySelector(".map-modal__link").setAttribute("href", link)
    }
    if (mapModal.querySelector(".map-modal__direction")) {
        mapModal.querySelector(".map-modal__direction").textContent = direction
    }
    if (mapModal.querySelector(".map-modal__title")) {
        mapModal.querySelector(".map-modal__title").textContent = title
    }
    mapModal.querySelector(".modal__content").style.transformOrigin = `${item.getBoundingClientRect().left}px ${item.getBoundingClientRect().top}px`
}
if (map && mapModal) {
    map.addEventListener("click", e => {
        if (map.querySelectorAll(".item-map").length) {
            map.querySelectorAll(".item-map").forEach(item => {
                if (item.contains(e.target)) {
                    setMap(item)
                    openModal(mapModal)
                    header.classList.add('unshow')
                }
            })
        }

    })
}
if (mapBtn && mapModal && mapModalMob) {
    let w, h, currW, startX, translateX, previousTranslateX, isMobileModalOpen
    mapBtn.addEventListener("click", () => {
        mapBtn.classList.add("loading")
        startX = 0
        translateX = 0;
        previousTranslateX = 0
        mapModalMob.querySelector(".mapMobile-modal__inner").style.transform = 'translateX(0px)';
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.transform = 'translateX(0px)';
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.backgroundPosition = 'left 0px center';
        mapModalMob.querySelector(".mapMobile-modal__inner").innerHTML = map.querySelector(".map__inner").innerHTML
        let layer = map.querySelector("[data-map-layer]").getAttribute("src")
        let layerimg = new Image()
        layerimg.src = layer
        layerimg.onload = function () {
            w = layerimg.width
            h = layerimg.height
            currW = w / (h / window.innerHeight)
            mapModalMob.querySelector(".mapMobile-modal__inner").style.width = currW + "px"
            mapModalMob.querySelector(".mapMobile-modal__preview-view").style.width = window.innerWidth / currW * 100 + "%"
            openModal(mapModalMob)
            mapBtn.classList.remove("loading")
        }
    })
    mapModalMob.querySelector(".modal__content").addEventListener("touchstart", e => {
        startX = e.touches[0].clientX
    })
    mapModalMob.querySelector(".modal__content").addEventListener("touchmove", e => {
        translateX = previousTranslateX + e.touches[0].clientX - startX;
        const maxTranslateX = 0;
        const minTranslateX = window.innerWidth - currW
        if (translateX > maxTranslateX) {
            translateX = maxTranslateX;
        } else if (translateX < minTranslateX) {
            translateX = minTranslateX;
        }
        mapModalMob.querySelector(".mapMobile-modal__inner").style.transform = `translateX(${translateX}px)`;
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.transform = `translateX(${-translateX / window.innerWidth * 100}%)`;
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.backgroundPosition = `left ${mapModalMob.querySelector(".mapMobile-modal__preview-view").clientWidth * translateX / window.innerWidth}px center`;
    })
    mapModalMob.querySelector(".modal__content").addEventListener('touchend', () => {
        previousTranslateX = translateX;
    });
    mapModalMob.querySelector(".modal__content").addEventListener('touchcancel', () => {
        translateX = previousTranslateX;
        mapModalMob.querySelector(".mapMobile-modal__inner").style.transform = `translateX(${translateX}px)`;
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.transform = `translateX(${-translateX / window.innerWidth * 100}%)`;
        mapModalMob.querySelector(".mapMobile-modal__preview-view").style.backgroundPosition = `left ${mapModalMob.querySelector(".mapMobile-modal__preview-view").clientWidth * translateX / window.innerWidth}px center`;
    });
    mapModalMob.addEventListener("click", e => {
        if (mapModalMob.querySelectorAll(".item-map").length) {
            mapModalMob.querySelectorAll(".item-map").forEach(item => {
                if (item.contains(e.target)) {
                    setMap(item)
                    //mapModal.classList.add("open")
                    isMobileModalOpen = true
                    openModal(mapModal)
                }
            })
        }
    })
    function mapResizeHandler() {
        console.log("d")
        if (mapModalMob.classList.contains("open")) {
            currW = w / (h / window.innerHeight)
            startX = 0
            translateX = 0;
            previousTranslateX = 0
            mapModalMob.querySelector(".mapMobile-modal__inner").style.width = currW + "px"
            mapModalMob.querySelector(".mapMobile-modal__inner").style.transform = `translateX(0)`;
            mapModalMob.querySelector(".mapMobile-modal__preview-view").style.width = window.innerWidth / currW * 100 + "%"
            mapModalMob.querySelector(".mapMobile-modal__preview-view").style.transform = `translateX(0)`;
            mapModalMob.querySelector(".mapMobile-modal__preview-view").style.backgroundPosition = `left 0px center`;
            if (window.innerWidth > bp.tablet && mapModalMob.classList.contains("open")) {
                closeModal(mapModalMob)
            }
        }
    }
    const mapDebounce = debounce(mapResizeHandler, 100)
    window.addEventListener("resize", mapDebounce);
    mapModal.querySelectorAll(".modal__close").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth < bp.tablet && isMobileModalOpen) {
                openModal(mapModalMob)
            }
            //mapResizeHandler()
        })
    })
    mapModalMob.querySelectorAll(".modal__close").forEach(item => {
        item.addEventListener("click", () => {
            isMobileModalOpen = false
        })
    })
}