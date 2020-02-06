# Auxium #

<!-- 
> This material was originally posted [here](http://www.quora.com/What-is-Amazons-approach-to-product-development-and-product-management). It is reproduced here for posterities sake.

There is an approach called "working backwards" that is widely used at Amazon. They work backwards from the customer, rather than starting with an idea for a product and trying to bolt customers onto it. While working backwards can be applied to any specific product decision, using this approach is especially important when developing new products or features.

For new initiatives a product manager typically starts by writing an internal press release announcing the finished product. The target audience for the press release is the new/updated product's customers, which can be retail customers or internal users of a tool or technology. Internal press releases are centered around the customer problem, how current solutions (internal or external) fail, and how the new product will blow away existing solutions.

If the benefits listed don't sound very interesting or exciting to customers, then perhaps they're not (and shouldn't be built). Instead, the product manager should keep iterating on the press release until they've come up with benefits that actually sound like benefits. Iterating on a press release is a lot less expensive than iterating on the product itself (and quicker!).

If the press release is more than a page and a half, it is probably too long. Keep it simple. 3-4 sentences for most paragraphs. Cut out the fat. Don't make it into a spec. You can accompany the press release with a FAQ that answers all of the other business or execution questions so the press release can stay focused on what the customer gets. My rule of thumb is that if the press release is hard to write, then the product is probably going to suck. Keep working at it until the outline for each paragraph flows. 

Oh, and I also like to write press-releases in what I call "Oprah-speak" for mainstream consumer products. Imagine you're sitting on Oprah's couch and have just explained the product to her, and then you listen as she explains it to her audience. That's "Oprah-speak", not "Geek-speak".

Once the project moves into development, the press release can be used as a touchstone; a guiding light. The product team can ask themselves, "Are we building what is in the press release?" If they find they're spending time building things that aren't in the press release (overbuilding), they need to ask themselves why. This keeps product development focused on achieving the customer benefits and not building extraneous stuff that takes longer to build, takes resources to maintain, and doesn't provide real customer benefit (at least not enough to warrant inclusion in the press release).
 -->

## Summary ##
  > Auxium is an application where the user can build and share playlists with songs that come from either Spotify or YouTube.

## Problem ##
  > My friends and I share a lot of music amongst outselves, often coming from different music sharing platforms. While doing this, I discovered there were times where one song could be found on one platform, but not on the one I used. This turned into me having 4 separate accounts to find music. So the objective of this application was to allow the user to gather their favorite songs in one place, no matter its source. 

## Customer Quote ##
  > "This application saved my life!" -Future customer, probably

## Requirements

- pgAdmin or psql shell, to create the postgreSQL database that will be populated

### Installing Dependencies
From within the root directory:

```sh
npm install -g webpack
npm install
```

## Creating Database
1. Within pgAdmin or psql (shell) create a database with the name "auxium"
2. Build the schema, and tables with:

```sh
npm run build-db
```

## Development
1. Start server
2. Bundle application with webpack
```sh
npm start
npm run build
```
3. Run in browser at: 
```http://localhost:3001/```

## API routes
To render different items in the browser: http:localhost:{ port }/?{ id# 1 - 10M }

|CRUD API ENDPOINTS           | DESCRIPTION                                                                          |
|-----------------------------|--------------------------------------------------------------------------------------|
|GET      /login              | Begins O-Auth process:equesting authorization to access data with user account login |
|GET      /callback           | Requests access and refresh tokens to be used for requests to Spotify API            |
|GET      /refresh_token      | Sends refresh_token requesting new access_token (expires after 1 hour)               |
|POST     /db/update_playlist | Adds song to playlist in database                                                    |
|DELETE   /db/delete_song     | Deletes song in database                                                             |
|GET      /db/get_playlist    | Retrieves playlist from the database                                                 |
