import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Item } from './item';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  itemsList = new BehaviorSubject([]);
  
private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform, 
    private sqlite: SQLite, 
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }
 
  fetchItems(): Observable<Item[]> {
    return this.itemsList.asObservable();
  }

    // Render fake data
    getFakeData() {
      this.httpClient.get(
        'assets/db.sql', 
        {responseType: 'text'}
      ).subscribe(data => {
        this.sqlPorter.importSqlToDb(this.storage, data)
          .then(_ => {
            this.getItems();
            this.isDbReady.next(true);
          })
          .catch(error => console.error(error));
      });
    }

  // Get list
  getItems(){
    return this.storage.executeSql('SELECT * FROM items', []).then(res => {
      const items: Item[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            detail: res.rows.item(i).detail
           });
        }
      }
      this.itemsList.next(items);
    });
  }

  // Add
  addItem(title, detail) {
    let data = [title, detail];
    return this.storage.executeSql('INSERT INTO items (title, detail) VALUES (?, ?)', data)
    .then(res => {
      this.getItems();
    });
  }

  // Delete
  deleteItem(id) {
    return this.storage.executeSql('DELETE FROM items WHERE id = ?', [id])
    .then(_ => {
      this.getItems();
    });
  }
 
  // Get single object
  getItem(id): Promise<Item> {
    return this.storage.executeSql('SELECT * FROM items WHERE id = ?', [id]).then(res => { 
      return {
        id: res.rows.item(0).id,
        title: res.rows.item(0).title,  
        detail: res.rows.item(0).detail
      }
    });
  }

  // Update
  updateItem(id, value: Item) {
    let data = [value.title, value.detail];
    return this.storage.executeSql(`UPDATE items SET title = ?, detail = ? WHERE id = ${id}`, data)
    .then(data => {
      this.getItems();
    })
  }
}