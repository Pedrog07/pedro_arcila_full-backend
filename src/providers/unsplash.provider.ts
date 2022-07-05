import { Injectable } from '@nestjs/common';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

@Injectable()
export class UnsplashProvider {
  photos: ReturnType<typeof createApi>['photos'];
  users: ReturnType<typeof createApi>['users'];
  search: ReturnType<typeof createApi>['search'];
  collections: ReturnType<typeof createApi>['collections'];
  topics: ReturnType<typeof createApi>['topics'];

  constructor() {
    const { photos, users, search, collections, topics } = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: nodeFetch as unknown as typeof fetch,
    });
    this.photos = photos;
    this.users = users;
    this.search = search;
    this.collections = collections;
    this.topics = topics;
  }
}
