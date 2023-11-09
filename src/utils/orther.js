export function onLoadIcon() {
    try{
      var btns = document.getElementsByClassName('btn');
      var btnss = document.getElementsByClassName('btnft');
      for(let i = 0; i < btns.length; i++){
        btns[i].classList.remove('show');
        // btns[i].style.color = '##222'
        btnss[i].style.color = '#4d5565'
      }
      let urlArr = window.location.href;
      if(urlArr.includes('buy')){
        try {
          document.getElementsByClassName('buy')[0].classList.add('show')
        } catch (error) {}
      }
      else if(urlArr.includes('market')){
        try {
          document.getElementsByClassName('market')[0].classList.add('show')
        } catch (error) { }
      }
      else if(urlArr.includes('person')){
        try {
          document.getElementsByClassName('person')[0].classList.add('show')
        } catch (error) {}
      }
      else{
        try {
          document.getElementsByClassName('home')[0].classList.add('show')
        } catch (error) {}
      }
      document.getElementsByClassName('show')[0].style.color = '#fd9e00'
      return;
    }catch(err){
      console.log(err)
    }
  }