<template>
    <div ref="bgContainer"
        class="bg-black pointer-events-none *:pointer-events-auto overflow-hidden w-full h-full will-change-transform">
        <div
            class="w-full absolute flex flex-col items-center justify-center select-none will-change-transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div ref="bgLogo" class="relative w-3/5 min-w-[320px]">
                <img ref="logoGE" :src="getPreRes('GE')" alt=""
                    class="w-full min-w-[320px] relative z-[4] will-change-transform">
                <img ref="logoAGENT" :src="getPreRes('AGENT')" alt=""
                    class="w-full min-w-[320px] absolute inset-0 z-[3] will-change-transform">
                <div ref="logoMask1" class="absolute inset-0 bg-black z-[3] will-change-transform"></div>
                <img ref="logoMyGO" :src="getPreRes('MyGO!!!')" alt=""
                    class="w-full min-w-[320px] absolute inset-0 z-[2] will-change-transform">
                <div ref="logoMask2" class="absolute inset-0 bg-black z-[2] will-change-transform"></div>
            </div>
        </div>
        <!-- <div class="absolute w-10 h-10 bg-slate-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        </div> -->
        <div ref="bgContent" class="bg w-full h-full absolute z-[5] overflow-hidden will-change-transform">
            <div v-if="systemStore.contentType === 'login'" class="w-full h-full absolute">
                <div v-if="!waitLogin"
                    class="w-full h-full flex flex-col items-center justify-center space-y-8 select-none login-left-card">
                    <img :src="getPreRes('All-deep')" alt="Logo" class="w-full mx-auto px-8 pt-8 absolute top-0">
                    <h1 class="text-6xl tracking-wide">GEAgent</h1>
                    <h2 class="text-3xl tracking-wide">Server-WebUI</h2>
                </div>
                <div v-if="waitLogin" class="wait-login-content absolute w-full h-full flex flex-col gap-36 lg:gap-60 items-center justify-center
                top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform">
                    <LoaderCircle v-show="!loginSuccess"
                        class="waitLogin-waitIcon w-24 h-24 lg:w-48 lg:h-48 text-primary" />
                    <CircleCheck v-show="loginSuccess" color="#3a886e"
                        class="waitLogin-successIcon w-24 h-24 lg:w-48 lg:h-48 text-primary" />
                    <loginStepper />
                </div>
            </div>
            <div v-else-if="systemStore.contentType === 'main'" class="">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import { preloader } from '@/services/preloader'
import { gsap } from 'gsap'
import { CircleX, LoaderCircle, CircleCheck } from "lucide-vue-next"
import loginStepper from '@/components/loginStepper.vue'




const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const bgContainer = ref(null)
const bgContent = ref(null)
const bgLogo = ref(null)
const logoMask1 = ref(null)
const logoMask2 = ref(null)
const logoGE = ref(null)
const logoAGENT = ref(null)
const logoMyGO = ref(null)
const loginLeftAnimation = ref(null)


onMounted(() => {
    router.isReady().then(() => {
        systemStore.setElement(bgContainer.value)
        systemStore.setContent(route.name)
        systemStore.currentRoute = route.name
        gsap.set(bgContent.value, {
            opacity: 1,
            scale: 1,
            xPercent: -50,
            yPercent: -50,
            left: '50%',
            top: '50%',
            width: '10%',
            height: systemStore.isMobile ? 2.5 : 5
        })
        gsap.set(bgLogo.value, {
            yPercent: -17,
        })
        gsap.set(logoMask1.value, {
            opacity: 1,
            scale: 1,
            left: '-36%',
            top: '-32.5%',
            width: '100%',
            height: '100%'
        })
        gsap.set(logoMask2.value, {
            opacity: 1,
            scale: 1,
            top: '-32.5%',
            width: '100%',
            height: '100%'
        })
        gsap.set(logoGE.value, {
            left: '36%',
        })
        gsap.set(logoAGENT.value, {
            left: '-36%',
        })
        gsap.set(logoMyGO.value, {
            top: '-34%'
        })
    })
})


// 监听路由属性变化
watch(() => route.name, (newRoute) => {
    nextTick(() => {
        if (newRoute === 'login') {
            gsap.set('.login-left-card h1', {
                y: 30,
                opacity: 0,
                filter: "blur(12px)"
            })
            gsap.set('.login-left-card h2', {
                y: 20,
                opacity: 0,
                filter: "blur(8px)"
            })
            gsap.set('.login-left-card img', {
                scale: 0.95,
                opacity: 0
            })
        }
    })
}, { immediate: true })

let loadTL = gsap.timeline()

watch(() => preloader.progress.value, (progress) => {
    console.log(progress)
    if (progress <= 100) {
        loadTL.add(gsap.to(bgContent.value, {
            duration: 0.25,
            width: `${10 + progress / 2.5}%`,
            ease: 'back.out(1.2)',
            onComplete: () => {
                if (progress === 100) {
                    loadTL = null
                    loadCompleteAnimation()
                }
            }
        }))
    }
})

function loadCompleteAnimation() {
    const tl = gsap.timeline()
    tl.to(bgContent.value, {
        duration: 1.2,
        width: '100%',
        ease: 'power4.inOut',
        onComplete: () => {
            gsap.set(bgContent.value, {
                left: 0,
                xPercent: 0,
            })
        }
    })
    tl.to(logoMask1.value, {
        duration: 1.2,
        left: '-72.5%',
        ease: 'power4.inOut'
    }, '<')
    tl.to(logoGE.value, {
        duration: 1.2,
        left: 0,
        ease: 'power4.inOut'
    }, '<')
    tl.to(logoAGENT.value, {
        duration: 1.2,
        left: 0,
        ease: 'power4.inOut'
    }, '<')
    tl.to(logoMyGO.value, {
        duration: 1.2,
        top: 0,
        ease: 'power4.inOut'
    }, '-=0.75')
    tl.to(bgContent.value, {
        duration: 0.8,
        height: '100%',
        ease: 'power4.inOut',
        onComplete: () => {
            bgLogo.value.style.display = 'none'
            bgContainer.value.classList.remove('bg-black');
            bgContainer.value.style.backgroundColor = 'transparent'
            systemStore.animationId = 'loginCardIn'
            if (route.name === 'login') {
                loadAnimationToLogin(tl)
            } else {
                loadAnimationToMain(tl)
                systemStore.animationId = 'mainIn'
            }
        }
    })
}

function loadAnimationToLogin(tl) {
    tl.to(bgContent.value, {
        duration: 0.8,
        width: '33.33%',
        ease: 'power4.out'
    })
    tl.to('.login-left-card h1', {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out"
    }, '-=0.4');
    tl.to('.login-left-card h2', {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.5");
    tl.to('.login-left-card img', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
    }, "-=0.4");
}

function loadAnimationToMain(tl) {
    tl.to(bgContent.value, {
        duration: 1.2,
        y: '100%',
        ease: "power4.inOut",
        onComplete: () => {
            bgContent.value.style.display = 'none'
            systemStore.setContent('main')
        }
    })
}


function getPreRes(id) {
    const resource = preloader.resources.find(r => r.id === id)
    return resource && resource.loaded ? resource.url : ''
}


watch(() => systemStore.animationId, (newValue) => {
    if (newValue === 'waitLogin') waitLoginAnimation1()
})

const waitLogin = ref(false)

function waitLoginAnimation1() {
    const tl = gsap.timeline()
    tl.to('.login-left-card h1', {
        y: 30,
        opacity: 0,
        filter: "blur(12px)",
        duration: 0.35,
        onComplete: () => {
            waitLogin.value = true
            nextTick(() => waitLoginAnimation2())
        }
    }, 0);
    tl.to('.login-left-card h2', {
        y: 20,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.35
    }, 0);
    tl.to('.login-left-card img', {
        scale: 0.95,
        opacity: 0,
        duration: 0.35
    }, 0);
    tl.to(bgContent.value, {
        duration: 0.75,
        width: '100%',
        ease: 'power4.inOut'
    }, 0);
}

const loginSuccess = ref(false)


function waitLoginAnimation2() {
    const tl = gsap.timeline({
        onComplete: () => simulateLoginSuccess()
    })
    tl.from('.wait-login-content', {
        duration: 0.4,
        opacity: 0,
        filter: 'blur(12px)',
        ease: 'power4.inOut'
    })
    gsap.to('.waitLogin-waitIcon', {
        rotation: "360",
        repeat: -1,
        duration: 1,
        ease: "none"
    });
}

function simulateLoginSuccess() {
    // 延迟3秒后执行登录成功动画
    setTimeout(() => {
        showLoginSuccessIcon();
    }, 1000); // 可根据需要调整延迟时间
}

function showLoginSuccessIcon() {
    const loadingIcon = document.querySelector('.waitLogin-waitIcon');
    const tl = gsap.timeline();
    tl.to(loadingIcon, {
        duration: 0.5,
        rotateY: 90,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
            loginSuccess.value = true;
            nextTick(() => {
                gsap.set('.waitLogin-successIcon', {
                    rotateY: -90,
                    opacity: 0
                });
                gsap.to('.waitLogin-successIcon', {
                    duration: 0.5,
                    rotateY: 0,
                    opacity: 1,
                    ease: "power2.out",
                    onComplete: () => {
                        router.push('/main')
                        systemStore.animationId = 'mainIn'
                        gsap.to(bgContent.value, {
                            duration: 1.2,
                            y: '100%',
                            ease: "power4.inOut",
                            onComplete: () => {
                                bgContent.value.style.display = 'none'
                                systemStore.setContent('main')
                            }
                        })
                    }
                });
            });
        }
    });
}


</script>

<style scoped>
.bg {
    background: linear-gradient(100deg, #f0cfd5, #d5c2e2, #e6d5c2);
}
</style>