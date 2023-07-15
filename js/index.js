let plot = (data) => {
  const ctx = document.getElementById('myChart');
  const dataset = {
    labels: data.hourly.time,
    datasets: [{
      label: 'Temperatura semanal',
      data: data.hourly.temperature_2m,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  const config = {
    type: 'line',
    data: dataset,
  };
  const chart = new Chart(ctx, config)
}

let bar = (data) => {
  const ctx = document.getElementById('myChart2');

  const dataset = {
    labels: data.daily.time,
    datasets: [{
      label: 'Indice UV',
      data: data.daily.uv_index_max,
      fill: false,
      borderColor: 'rgb(20, 20, 20)',
      tension: 0.1
    }]
  };
  const config = {
    type: 'bar',
    data: dataset,
  };
  const chart = new Chart(ctx, config)
}

let load = (data) => {
  console.log(data);
  let latitud = data["latitude"];
  let longitude = data["longitude"];
  let timezone = data["timezone"];
  let elevation = data["elevation"];
  document.getElementById("latitude").innerText = latitud;
  document.getElementById("longitude").innerText = longitude;
  document.getElementById("timezone").innerText = timezone;
  document.getElementById("elevation").innerText = elevation;
  plot(data);
  bar(data)
}

let loadInocar = () => {
  let url_proxy = 'https://cors-anywhere.herokuapp.com/'
  let URL = url_proxy + 'https://www.inocar.mil.ec/mareas/consultan.php';
  fetch(URL)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "text/html");
      let contenedorMareas = xml.getElementsByClassName('container-fluid')[0];
      let contenedorHTML = document.getElementById('table-container');
      contenedorHTML.innerHTML = contenedorMareas.innerHTML;
    })
    .catch(console.error);
}

(function () {
  let meteo = localStorage.getItem('meteo');
  if (meteo == null) {
    let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m&daily=uv_index_max&timezone=auto';
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        load(data)
        localStorage.setItem("meteo", JSON.stringify(data))
        console.log(data)
      })
      .catch(console.error);
  } else {
    load(JSON.parse(meteo))
  }
  loadInocar();
})();


