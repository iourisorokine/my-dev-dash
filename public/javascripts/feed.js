const pinElement = (e, index) => {
  e.preventDefault();
  e.target.innerText = 'Saved!';
  e.target.setAttribute('onclick', `removeElement(event, ${index})`);
  setTimeout(() => e.target.innerText = 'Remove this', 1000);
  axios.post(`/user/pin/${index}`, {
    index
  });
}

const removeElement = (e, index) => {
  e.preventDefault();
  e.target.innerText = 'Removed!';
  e.target.setAttribute('onclick', `pinElement(event, ${index})`);
  setTimeout(() => e.target.innerText = 'Pin this', 1000);
  axios.post(`/user/remove/${index}`, {
    index
  });
}