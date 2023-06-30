# Interactive CYOA Maker

Interactive CYOA Maker is an early-stage project that aims to provide a simple tool for creating interactive Choose Your Own Adventure (CYOA) stories. The goal is to allow users to craft their own branching narratives and share them with others. Please note that this project is currently in early development, and features may be limited or subject to change.

Interactive CYOA Maker is a hobby project created to address the need for a more efficient and optimized tool for creating CYOA stories. Existing tools often suffer from performance issues like lag and slow loading times. One contributing factor is the use of unoptimized save files that include entire images encoded in Base64 format. In contrast, Interactive CYOA Maker takes a different approach by saving images to a server or database and storing only the image IDs in the save files. This approach aims to improve overall performance and loading times, providing users with a smoother experience.

## Features

- **Intuitive Interface:** The CYOA Maker offers a user-friendly interface, making it easy to create interactive stories with branching paths.
- **Branching Storylines:** Create multiple storylines with choices, allowing readers to navigate different paths and experience varied outcomes.
- **Export and Share:** Export your completed stories to a readable format, making it simple to share them with others and gather feedback.
- **Complex Rule Set:** Customize your CYOA story's flow using a flexible rule system. This feature empowers you to create dynamic narratives by implementing user-defined rules. Show, hide, or alter story segments based on various conditions and triggers, including point systems, flag systems, and more. Design intricate storylines that adapt to player choices, creating an interactive and immersive experience.

## Getting Started

1. **Installation:** Clone this repository to your local machine.


```
git clone https://github.com/crasty01/interactive-cyoa-maker.git
```

2. **Dependencies:** Install the necessary dependencies by running the following command:

```
pnpm install
```
3. **Development Server:** Start the development server to begin using the CYOA Maker.

```
pnpm run dev
```
4. **Open in Browser:** Open your preferred web browser and navigate to `http://localhost:5173` to access the CYOA Maker.

## Contributing

I welcome contributions to enhance the Interactive CYOA Maker. If you're interested in contributing, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive commit messages.
4. Push your changes to your forked repository.
5. Submit a pull request, explaining your changes in detail.

## TODO:

- [ ] Implement a save/load functionality for created stories.
- [ ] Add support for adding images and multimedia to the stories.
- [ ] Improve the user interface to enhance the story creation experience.
- [ ] Implement a preview feature to visualize the story flow and choices.
- [ ] Add a feature to export stories in different formats (e.g., PDF, HTML).
- [ ] Implement a search functionality to find specific sections or choices within a story.
- [ ] Add support for collaborative story creation and editing.
- [ ] Enhance error handling and validation for better user feedback.
- [ ] Improve accessibility and ensure compatibility across different browsers.
- [ ] Write comprehensive documentation and provide usage examples.
- [ ] Explore options for monetization or additional features based on user feedback.

Feel free to contribute to this project by working on any of the above tasks. Make sure to follow the contribution guidelines mentioned earlier in this document.

## Contact

For any questions or suggestions, please feel free to contact me via Discord. You can reach out to **@crasty** through direct message (DM) on Discord.

Thank you for your interest in the Interactive CYOA Maker! I appreciate your support as we continue to develop and improve this tool.