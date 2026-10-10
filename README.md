# Tseba Ka Lesotho

An interactive, responsive tourism guide that helps local and international visitors explore destinations, activities, and cultural experiences in Lesotho. The interface is built with React and uses Lesotho’s flag colors throughout.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| ![Full-page desktop screenshot](./screenshots/full-page.png) | ![Mobile screenshot](./screenshots/mobile.png) |

## Features

- A landing page introducing Lesotho, with featured experiences and a destinations section.
- Eight data-driven attractions, each with its name, image, location, category, description, activities, estimated cost, and visit duration.
- Search by attraction name, location, or description, with category filters and dynamically updated results.
- Four attractions shown initially on the home page; **Explore them all** reveals the remaining results.
- Attraction detail dialogs with activity, duration, and estimated-cost information.
- Save and filter favourite attractions during the current app session.
- English and Sesotho interface translations, with the language preference saved in browser local storage.
- Visitor enquiry form with an international calling-code selector. It validates the name (letters and common punctuation, up to 20 characters), email address, phone number (7–15 digits), destination, visitor count, visit date, and message. A successful submission displays an on-page confirmation.
- Responsive navigation and layouts for desktop, tablet, and mobile, plus reduced-motion support.
- Animated hero text, destination metrics, and enquiry form reveal.

## Pages

The application supports the following paths:

| Path | Content |
| --- | --- |
| `/` | Home, featured destinations, and visitor enquiry form |
| `/destinations` | Searchable and filterable attraction directory |
| `/experiences` | Adventure and nature experiences |
| `/about` | Lesotho introduction and destination statistics |
| `/plan` | Visitor enquiry form |

Navigation uses the browser History API; no routing library is required.

## Requirements

- Node.js and npm
- An internet connection for remotely hosted photography and Google Fonts

## Run locally

From the project root, install dependencies and start the development server:

```bash
npm install
npm start
```

The development server opens at [http://localhost:3000](http://localhost:3000). In PowerShell on Windows, use `npm.cmd` if the `npm` PowerShell script is blocked:

```powershell
npm.cmd install
npm.cmd start
```

## Test and build

Run the test suite:

```bash
npm test -- --watchAll=false
```

Create an optimized production build:

```bash
npm run build
```

## Project structure

```text
public/
  index.html                 HTML entry point and page metadata
  manifest.json              Web app metadata
screenshots/
  full-page.png              Desktop project screenshot
  mobile.png                 Mobile project screenshot
src/
  components/
    AnimatedMetric.js        Animated statistic
    AttractionCard.js        Reusable attraction card
    AttractionModal.js       Attraction details dialog
    Brand.js                 Shared brand mark
    EnquiryForm.js           Visitor enquiry form
    Icon.js                  Shared SVG icons
    SiteFooter.js            Shared footer and social links
    SiteHeader.js            Shared navigation, search, and language selector
  context/
    LanguageContext.js       English/Sesotho translations and localization
  controllers/
    useEnquiryController.js   Enquiry state, input handling, and validation
    useTourismController.js   Search, filters, favourites, and attraction state
  data/
    countryCallingCodes.js    International calling-code options
  images/
    logo.png                 Site logo
  models/
    attractions.js           Attraction data and lookup helper
  pages/
    PageContent.js            Destination, experience, about, and plan pages
  App.css                     Application layout, components, and animations
  App.js                      App composition and page navigation
  App.test.js                 UI and interaction tests
  index.css                   Global styles and color variables
  index.js                    React application entry point
```

## Data, validation, and privacy

Attraction content is stored as JavaScript objects in `src/models/attractions.js` and rendered by reusable React components. The enquiry form validates input in the browser and displays a confirmation, but this demonstration does **not** send enquiries to a server or persist them. Favourites are held in app state and are not retained after a reload. The selected language is retained in local storage.

Estimated visiting costs are illustrative Maloti (M) amounts, not guaranteed current prices. Confirm prices, availability, and travel conditions with local providers before visiting.

## Image and font sources

The logo is included in `src/images/logo.png`. The hero and cultural-strip photographs are loaded from [Unsplash](https://unsplash.com/). Attraction photographs are loaded from the image URLs recorded alongside each attraction in `src/models/attractions.js`; their source hosts are:

- Sani Pass: `sanipassprivatetours.com` (served through the `i0.wp.com` image proxy)
- Maletsunyane Falls: `dreamstime.com`
- Katse Dam: `inr.org.za`
- Thaba Bosiu: `placemania.sk`
- Sehlabathebe National Park: `nationalparksassociation.org`
- Afriski Mountain Resort: `daeweb.com` (Amazon S3-hosted image)
- Subeng Dinosaur Footprints: `traveltourxp.com`
- Morija Museum & Archives: `selibeng.com`

Remote images and fonts require internet access and remain subject to their providers’ availability and usage terms. Google Fonts (`DM Sans` and `DM Serif Display`) are imported from Google Fonts in `src/App.css`.

## Publish to GitHub

Create an empty repository on GitHub, then add it as the remote and push the current branch:

```bash
git remote add origin https://github.com/<your-user>/<your-repository>.git
git push -u origin HEAD
```

Replace the placeholders with your GitHub username and repository name. The project is locally version-controlled; pushing it makes the source, README, and screenshots available in the GitHub repository.
