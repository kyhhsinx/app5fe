import { createRouter, createWebHistory } from 'vue-router'
import Maket from '../views/Market/index.vue'
import Buy from '../views/Buy/index.vue'
import Person from '../views/Person/index.vue'
import Analysis from '../views/Person/index.vue'
import Not from '../views/Layout/not.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import('../views/Home/index.vue')
    }
    ,
    {
      path: '/market',
      name: 'market',
      component: Maket
    }
    ,
    {
      path: '/buy/:id?',
      name: 'buy',
      component: Buy
    }
    ,
    {
      path: '/person',
      name: 'person',
      component: Person
    },
  
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis
    }
    ,
    {
      path: '/no-support',
      name: 'support',
      component: Not
    }
  ]
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  if(to.path.includes('/buy') || to.path.includes('/market') || to.path.includes('/person')){
      try {
        var items = document.querySelector('.slide-wrapper').querySelectorAll('.btn-close')
        for(let i = 0;i < items.length ;i++ ){
            items[i].click()
            console.log(items);
        }
      } catch (error) {
        console.log(error)
      }
  }
  if (authRequired && !loggedIn) {
    next("/");
  } else {
    next();
  }
});

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dyFireAntcally imported module')) {
    window.location = to.fullPath
  }
})

function reloadPage() {
  const currentPath = window.location.pathname;
  if (currentPath === '/' || currentPath === '/market' || currentPath === '/person' ) {
    window.location.reload();
  }
}

setInterval(reloadPage, 10 * 60 * 1000);

export default router
