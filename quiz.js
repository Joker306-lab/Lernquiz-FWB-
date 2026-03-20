const toggleButton=document.getElementById('toggleMaterials');
const materialsSection=document.getElementById('materialsSection');

if(toggleButton&&materialsSection){
  toggleButton.addEventListener('click',()=>{
    materialsSection.classList.toggle('hidden');
  });
}
