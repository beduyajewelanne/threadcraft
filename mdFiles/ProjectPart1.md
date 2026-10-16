# ThreadCraft Studio

### Project Part 1: Project Framing and Design Brief

Proposal created by:
Armamento, Kevin · Atinto, Lee Anthony · Beduya, Jewel Anne · Cabrera, Alexandra Nicole

---

## Table of Contents

1. [Project Identity](#project-identity)
2. [Problem or Opportunity Statement](#problem-or-opportunity-statement)
3. [Intended Audience and Context](#intended-audience-and-context)
4. [Purpose and Desired Outcome](#purpose-and-desired-outcome)
5. [Platform and Use Context](#platform-and-use-context)
6. [Initial Scope](#initial-scope)
7. [Assumptions, Constraints, and Risks](#assumptions-constraints-and-risks)
8. [Initial Success Criteria](#initial-success-criteria)
9. [Initial Concept Direction](#initial-concept-direction)
10. [References](#references)

---

## Project Identity

| Field | Details |
|---|---|
| Working Project Title | ThreadCraft Studio |
| Team Members | Kevin Armamento, Lee Anthony Atinto, Jewel Anne Beduya, Alexandra Nicole Cabrera |
| Submission Date | September 11, 2026 |
| Project Category / Type | Interactive Web Application |

### Concept Statement

ThreadCraft Studio is a browser based interactive web application that focuses on fashion lovers, online shoppers such as the teens, students, gen z or other people that love to have a customize clothes. This is a design personalized garments through a rotational viewport, real-time color and text customization.

---

## Problem or Opportunity Statement

People who loves shopping and other fashion enthusiasts people who wants to express their personal style often buys already design clothes. While many people wants to design and customize their own clothes to reflect their own personal creativity, they lack the platform to access or to have these kind of tools. With these in mind, they can't also see how their ideas will actually look on a finished design before buying.

What these people need is to have an accessible, beginner friendly way to experiment their ideas using the colors and other ideas that they want to see. A browser base interactive media experience is an ideal for this problem for the reason that this will allow the buyers or users to have a visual preview to their custom or personalize concepts. Through this visual feedback, they can instantly saw the result of what they want to have before making a decision to purchase or make the product itself.

---

## Intended Audience and Context

| Area | Information to Provide |
|---|---|
| Primary audience | The target users are everyday online shoppers and fashion lovers who enjoy customizing their own clothes. |
| User goal | Customize a shirt or hoodie using colors, text, and graphics, and inspect the design in real-time before saving it. |
| Prior knowledge | Familiarity with e-commerce shopping apps (such as Shopee, Lazada, or Instagram shops) and basic knowledge of handling image files if they are uploading their own designs. |
| Devices | Both desktop/laptops and mobile phones, ensuring full optimization for users switching between detailed desktop editing and quick mobile browsing. |
| Access conditions | Normal to fast broadband or mobile data connections; lightweight assets are prioritized to ensure fast load times for clothing mock-up previews. |
| Use environment | Accessible anywhere, whether users are browsing from home on a desktop, relaxing in a dorm with a laptop, or checking the platform on a phone while commuting. |
| Accessibility considerations | Designing features for diverse user needs such as using clear fonts and high-contrast colors for those with visual impairments. |
| Privacy and ethics | Ensuring the secure handling and protection of customer personal information and user data privacy, alongside ethical safeguards like preventing users from uploading copyrighted or inappropriate designs for custom apparel. |

---

## Purpose and Desired Outcome

Purpose: Help online shoppers personalize a shirt or hoodie design and see how it will actually look before deciding to purchase.

Desired outcomes:

- Users can customize a garment's color, text, and placement and see the changes reflected instantly.
- Users can rotate the garment to view it from multiple angles before deciding whether to buy.
- Users can complete the customization process without needing prior design software experience.
- Users can use the customization tools on both desktop and mobile without losing core functionality.

---

## Platform and Use Context

| Consideration | Details |
|---|---|
| Expected screen sizes | Renders cleanly across compact mobile viewports (from 375px wide) up to large desktop and laptop monitors (1080p and higher). |
| Must work on mobile devices? | Fully responsive and optimized for mobile devices so users can browse and place orders conveniently from their phones. |
| Likely network conditions | Normal to fast broadband or mobile data connection; lightweight assets are prioritized to ensure fast load times for clothing mock-up previews. |
| Where and when it will be used | Accessible at any time of day, whether users are shopping casually from a phone while out or designing items carefully on a desktop at home. |
| Can sound be used? | Audio is unnecessary for the customization process. The interface relies purely on visual feedback, smooth transitions, and UI indicators. |
| Browser or device limitations | Requires an updated modern browser (such as Chrome, Safari, Firefox, or Edge) with JavaScript enabled to support the interactive customization canvas. |
| Captions, transcripts, reduced motion, or low-bandwidth alternatives | Image optimization and lazy-loading techniques should be implemented to support users on slightly slower connections or mid-range devices during asset uploads. |

---

## Initial Scope

| In Scope | Out of Scope |
|---|---|
| Garment type limited to shirt and hoodie only | Other garment types (pants, jackets, accessories, etc.) |
| User account: Register, Login | Advanced account features (password recovery, social login, profile management) |
| Browse Products screen | Full product catalog/search/filter system |
| Customize Clothes: change fabric color, select size, add custom text, add custom picture (upload), draw freehand artwork, rotate & inspect 360°; all changes rendered in real time on the preview | Full 3D/WebGL garment modeling engine (rotation uses lightweight real-time rendering with Canvas/SVG layering, not a fully modeled 3D object) |
| Save Design (store and retrieve a user's finished design) | Cart, checkout, and payment processing |

---

## Assumptions, Constraints, and Risks

### Assumptions

| Assumption | Why It Needs Verification |
|---|---|
| Users have access to a smartphone, tablet, or computer capable of running a modern web browser. | Not all users may have devices with the same performance or screen size. |
| Users have access to an internet connection sufficient to load garment images and design previews. | Internet speed and connection quality may vary among users. |
| Users can perform basic actions such as selecting a garment, changing colors, adding text, and uploading an image. | Some first-time users may need guidance when using customization features. |
| Users understand basic file handling when uploading an image, such as selecting a JPG or PNG file. | Some users may be unfamiliar with file types or file-size requirements. |

### Constraints

| Constraint | Effect on the Project |
|---|---|
| Fixed semester timeline with limited development weeks shared among four team members and other coursework. | Limits the number of screens, garment types, and customization features that can be fully developed and tested. |
| Team relies on free or academic-tier tools and open-source 3D/canvas libraries. | Limits the use of advanced rendering features such as highly realistic 3D fabric simulation. |
| Browser and device compatibility must support common modern browsers such as Chrome, Firefox, and Edge. | Older browsers or devices with limited JavaScript support may not be fully supported. |
| The system is focused on garment customization and saving designs only. | Features such as online purchasing, payment, checkout, delivery, and order management are outside the project's scope. |

### Risks and Preventive Actions

| Risk | Possible Effect | Preventive Action / Response |
|---|---|---|
| Large mock-up images or 3D assets slow down page loading, especially on mobile devices. | Users may leave the customization screen before finishing their design. | Compress and optimize garment images and textures; use a lightweight preview when necessary. |
| Users upload copyrighted or inappropriate images. | Saved designs may contain unauthorized or inappropriate content. | Add an upload disclaimer and basic file-type and file-size validation. |
| The rotational viewport or drag-to-rotate interaction is difficult to use. | Some users may have difficulty viewing or inspecting their customized garment. | Provide simple rotation buttons and keyboard controls as alternatives to drag-to-rotate. |
| Project scope grows beyond what four members can complete in one semester. | Important features such as customization and saving designs may remain unfinished. | Finalize the project scope early, monitor progress weekly, and move additional features to the future-work list. |
| Customized designs are not saved correctly. | Users may lose their completed designs and become frustrated with the system. | Test the Save Design function regularly and ensure all selected customization settings are stored correctly. |

---

## Initial Success Criteria

The following measurable criteria will later be used to test whether ThreadCraft Studio meets the needs of its intended audience.

1. A first-time user can register an account and log in without assistance.
2. A user can select a garment type and browse the available garments before starting customization.
3. A user can customize a garment by changing the fabric color, selecting a size, adding custom text, uploading a picture, or drawing freehand artwork.
4. Users receive immediate visual feedback when making changes to the garment, such as changing the color, adding text, or adding an image.
5. Users can rotate and inspect the customized garment using the Rotate & Inspect 360° feature.
6. At least 90% of usability-test participants can locate and use the main customization features, including Change Fabric Color, Select Size, Add Custom Text, Add Custom Picture, and Draw Freehand Artwork, without additional instructions.
7. Users can successfully save their customized garment using the Save Design function without losing their selected color, size, text, images, or artwork.
8. A saved design can be accessed again and displays the user's previously saved customization correctly.

---

## Initial Concept Direction

Two rough concept sketches were explored to represent different parts of the overall ThreadCraft Studio experience: the browsing entry point and the core customization interaction. These are exploratory layout diagrams, not final wireframes.

### Concept A: Home / Browse Layout

This page serves as the main entry point of ThreadCraft Studio. It allows users to browse different garment types and select a garment they want to customize. The layout includes a search bar, categories, filters, and a product grid to make garment selection simple and organized.

```text
+--------------------------------------------------------------+
|  LOGO    [Search bar]            [Cart] [Login]              |
+--------------------------------------------------------------+
|              Categories: Shirts | Hoodies                    |
+--------------------------------------------------------------+
|                |  +----------------+  +----------------+      |
|                |  |    Product     |  |    Product     |      |
|                |  |     Card       |  |     Card       |      |
|     Sample     |  +----------------+  +----------------+      |
|     Shirts     |  +----------------+  +----------------+      |
|       or       |  |    Product     |  |    Product     |      |
|     Hoodie     |  |     Card       |  |     Card       |      |
|                |  +----------------+  +----------------+      |
|                |  +----------------+  +----------------+      |
|                |  |    Product     |  |    Product     |      |
|                |  |     Card       |  |     Card       |      |
|                |  +----------------+  +----------------+      |
+--------------------------------------------------------------+
```

### Concept B: Customization Studio

This main design workspace uses a split layout that pairs a live, rotatable 2D/3D garment preview and real-time price tracker on the left with a 5-step editing panel on the right. This setup was chosen to solve user uncertainty, giving buyers instant visual feedback on every logo, text, or color change so they can catch mistakes before purchasing.

```text
+-------------------------------------------------------------------+
| [Logo] ThreadCraft - Interactive Custom Apparel Studio            |
+-------------------------------------------------------------------+
|          Studio  |  Customize  |  Drawing  |  Summary             |
+-------------------------------------------------------------------+
|  Apparel Preview          |  Customize Your Apparel               |
|  +---------------------+  |  +----------------------------------+ |
|  |                     |  |  | 1. Choose Apparel                | |
|  |                     |  |  | [Classic T-Shirt] [Pullover      | |
|  |       3D / 2D       |  |  |  Hoodie]                         | |
|  |       GARMENT       |  |  +----------------------------------+ |
|  |       RENDER        |  |  | 2. Choose Size                   | |
|  |                     |  |  | (o) S (o) M (o) L (o) XL (o) 2XL | |
|  |  (rotate control    |  |  +----------------------------------+ |
|  |       below)        |  |  | 3. Choose Fabric Color           | |
|  |                     |  |  | [swatch] [swatch] [swatch]       | |
|  +---------------------+  |  | [swatch]                         | |
|       I (rotate)          |  +----------------------------------+ |
|  +---------------------+  |  | 4. Add Text / Logo               | |
|  | Current Price: P0.00|  |  | [Text input] [Upload Image]      | |
|  +---------------------+  |  +----------------------------------+ |
|                           |  | 5. Placement & Fabric Options    | |
|                           |  | (move / resize / rotate design)  | |
|                           |  +----------------------------------+ |
|                           |            Save Design                |
+-------------------------------------------------------------------+
```

---

## References

1. Kang, H. J., Shin, J.-H., & Ponto, K. (2020). How 3D virtual reality stores can shape consumer purchase decisions: The roles of informativeness and playfulness. Journal of Interactive Marketing, 49, 70–85. https://www.sciencedirect.com/science/article/abs/pii/S1094996819300921
2. Gazzola, M., Del Baldo, M., & Kunene, A. (2024). The impact of online customised and personalised apparel. ResearchGate Publication, 386329751. https://www.researchgate.net/publication/386329751_The_impact_of_online_customised_and_personalised_apparel
3. Dziak, M. (2023). Responsive web design (RWD). EBSCO Research Starters. https://www.ebsco.com/research-starters/computer-science/responsive-web-design-rwd