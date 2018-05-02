export class Gmap {
  constructor(address) {
    // Global Google Map Parameters
    this.gmap = {
      elem    : document.querySelector('#map'),
      zoom    : 15,
      map     : null,
      geocoder: null,
      center  : '名古屋駅',
      marker  : [],
      icon    : 'https://vignette.wikia.nocookie.net/patapon/images/d/d5/Kibapon.png' // Marker default icon
    };
    // API URL
    this.api = {
      geocode: 'https://maps.googleapis.com/maps/api/geocode/json'
    };

    if (address) {
      // addressをセンターに設定
      this.gmap.center = address
    }
  }

  // Initialize Google Map
  initMap() {
    return new Promise((resolve, reject) => {
      this.geocode(this.gmap.center)
          .then(latlng => {
            this.gmap.map = new google.maps.Map(this.gmap.elem, {
              zoom  : this.gmap.zoom,
              center: latlng
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
    });
  }

  // Initialize Geocoder
  initGeocoder() {
    if (!this.gmap.geocoder) {
      this.gmap.geocoder = new google.maps.Geocoder();
    }
  }

  // ディレクション関連の初期化
  directionInit() {
    this.direction = {
      service : new google.maps.DirectionsService(),
      renderer: new google.maps.DirectionsRenderer()
    };
    this.direction.renderer.setMap(this.gmap.map);
  }

  // 2地点間ルーティング
  routing(from, to) {
    return new Promise((resolve, reject) => {
      if (!this.direction) {
        this.directionInit();
      }

      const request = {
        origin     : from,
        destination: to,
        travelMode : google.maps.TravelMode.WALKING
      };
      this.direction.service.route(request, (result, status) => {
        if (status !== 'OK') {
          reject(status);
          return;
        }
        this.direction.renderer.setDirections(result);
        resolve();
      });
    })
  }

  // Set Marker by [lat, lng]
  createMarker(latlng, image) {
    let icon = null;
    if (image) {
      icon = {
        url       : image,
        scaledSize: new google.maps.Size(50, 50)
      }
    }

    return new google.maps.Marker({
      position : latlng,
      map      : this.gmap.map,
      icon     : icon,
      animation: google.maps.Animation.DROP
    });
  }

  // Set Markers to Map from [addresses..]
  setMarkers(addresses) {
    let func = address => {
      this.geocode(address)
          .then((latlng) => {
            this.createMarker(latlng);
          });
    };
    this.setForeach(addresses, 200, func);
  }

  setMarkerOnMap(address) {
    // ジオコードして緯度経度を取得
    this.geocode(address).then(latlng => {
      // 取得した緯度経度にマーカーを生成
      this.gmap.marker += this.createMarker(latlng, this.gmap.icon)
    });
  }

  // Get [lat, lng] by Address
  geocode(address) {
    this.initGeocoder();

    return new Promise((resolve, reject) => {
      const url = this.query(this.api.geocode, {address: address});

      fetch(url)
          .then(res => {
            return res.json();
          })
          .then(body => {
            if (body.error_message) {
              console.error(body.error_message);
              reject(body.error_message);
              return;
            }
            let res = body.results[0];
            let latlng = res.geometry.location;

            // return lat, lng
            resolve(latlng);
          });
    });
  }

  query(url, params) {
    let query = new URL(url);
    Object.keys(params).forEach(key => {
      query.searchParams.append(key, params[key])
    });
    return query;
  }

  // iterate by setTimeout
  setForeach(ary, time, func) {
    let to = function () {
      let f = Array.prototype.shift.apply(arguments);
      let args = arguments;
      return setTimeout(() => {
        f.apply(null, args)
      }, time);
    };

    let i = 0;
    to(function f(fin) {
      if (!(i < ary.length - 1)) return;
      func(ary[i]);
      i++;
      to(f, fin);
    });
  }

  // Load a Google Maps API
  static loadScript() {
    return new Promise(resolve => {
      // envがある場合はAPI Keyを追加
      let apiKey = "";
      if (typeof process !== 'undefined') {
        apiKey = process.env.GOOGLEMAP_API_KEY;
      }
      let mapApi = document.createElement('script');
      mapApi.src = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey;
      mapApi.onload = resolve;

      document.body.appendChild(mapApi);
    })
  }
}