function displayAdvertisement(apiUrl, containerSelector) {
  // Fetch the advertisement from the API
//   fetch()
//     .then(response => response.json())
//     .then(data => {
      // Get the container element
      const container = document.querySelector(containerSelector);

      // Create an image element and set its properties
      const image = document.createElement('img');
      image.src = "https://picsum.photos/200/300";
      image.alt = "abc.jpg";
      image.style.width = "500px";
      image.style.height = "500px";

      // Append the image to the container element
      container.appendChild(image);
    // })
    // .catch(error => console.error('Error fetching advertisement', error));
}

export { displayAdvertisement };