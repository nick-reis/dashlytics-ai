# Dashlytics AI
  
*Empowering your data with intelligent insights.*

## 🚀 Overview

Dashlytics AI is a scalable system designed to **transform natural language questions into SQL queries**, fetch the relevant data, and provide **concise AI-generated summaries** directly in your dashboard. It empowers users to explore products, sales, and customer data **without staring at data tables**.

Whether you’re managing inventory, analyzing sales trends, or monitoring customer behavior, the assistant provides actionable insights in plain English - making data-driven decisions faster and easier.

## 🎯 Motivation

In modern applications, data analysis and interpretation can be daunting. Our goal is to simplify this by embedding an AI assistant directly into your dashboard, offering real-time insights and recommendations, and generating graphs. This approach ensures that users can make informed decisions without the need to switch between multiple tools or interfaces.

## 🔧 Features

- **AI-Powered Data Analysis**: Automatically analyze datasets and generate meaningful insights.  
- **Summary Generation**: Receive concise, human-readable summaries of complex data.
- **Create Graphs**: Easiy generate any graph from your data to drive meaningful business decisions
- **Scalable System**: AI generates SQL queries to only access the data it needs, supporting thousands of rows of data.  
- **Responsive Design**: Optimized for both desktop and mobile devices.



## 🛠️ Installation

To get started with Dashlytics:

1. Clone the repository:

   ```bash
   git clone https://github.com/nick-reis/dashlytics-ai.git
   cd dashlytics-ai

2. Install dependencies:
    ```bash
   npm install

3. Create a .env file in the root directory with your Supabase and AI credentials:
   ```bash
   OPENAI_API_KEY=your-api-key
   OPEN_AI_MODEL=model-of-choice
   NEXT_PUBLIC_SUPABASE_URL=your-public-url
   SUPABASE_SERVICE_ROLL_KEY=your-service-roll-key

4. Download schema from Supabase
    ```bash
   npx supabase db dump

5. Start the development server
   npm run dev


