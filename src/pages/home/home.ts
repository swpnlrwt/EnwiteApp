import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DetailsPage} from '../details/details';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    lat: any;
    long: any;
    restList: any;
    userKey = '06bd63d97c3d82f26e71d306a701fb7c';

    constructor(public navCtrl: NavController, private geolocation: Geolocation, private httpClient: HttpClient) {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.long = resp.coords.longitude;
            console.log(this.lat, this.long);
            this.getRestaurantListByLocation();

        }).catch((error) => {
            console.log('Error getting location', error);
        });

    }

    getRestaurantListByLocation() {
        this.httpClient.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${this.lat}&lon=${this.long}`, this.getOptions()).subscribe(data => {
            console.log(data.nearby_restaurants);
            this.restList = data.nearby_restaurants;
        });
    }

    getRestaurantList(searchText) {
        if (searchText.trim() !== '') {
            this.httpClient.get(`https://developers.zomato.com/api/v2.1/search?q=${searchText}`, this.getOptions()).subscribe(data => {
                this.restList = data.restaurants;
            });
        } else {
            this.getRestaurantListByLocation();
        }
    }

    private getOptions() {
        const headers = new HttpHeaders({
            'user-key': this.userKey
        });
        return {headers: headers};
    }

    showDetails(details: any) {
        this.navCtrl.push(DetailsPage, {
            data: details
        });
    }

}
