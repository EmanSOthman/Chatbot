# 🤖 Lexa

A serverless, scalable non-developer support chatbot system powered by **Amazon Lex**, **AWS Services**, **AWS Amplify**, **Cognito**, **DynamoDB**, **Lambda**, and a **React** frontend. This platform enables non-developer interact and manage with AWS Basic operations through human-like conversations, by chatting with high intelligent ChatBot.

---

# 🧠 Architecture Overview

## Main Components

```mermaid
graph TD
  A[React Frontend<br>via AWS Amplify Hosting]
  B[Cognito User Auth]
  C[DynamoDB]
  D[Amazon Lex V2 Bot]
  E[Lambda Fulfillment Function]

  A --> B
  A --> D
  D --> E
  E --> C

---

## 🚀 Installation Instructions

### Prerequisites

- Node.js (v16+)
- AWS CLI configured
- Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- AWS account with appropriate IAM access

### Steps

1. **Clone the repo**  
   ```bash
   git clone https://github.com/EmanSOthman/Chatbot.git
   cd Chatbot
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Initialize Amplify project**  
   ```bash
   amplify init
   ```

4. **Add required services**  
   ```bash
   amplify add auth       # Cognito
   amplify add api        # GraphQL (AppSync)
   amplify add function   # Lambda
   amplify push
   ```

5. **Connect Lex with Lambda**  
   Configure the Lex bot via the AWS Console and link the fulfillment Lambda function.

---

## ⚙️ Configuration & Environment Setup

- **React `.env` file**:
  ```
  REACT_APP_GRAPHQL_ENDPOINT=https://your-api-id.appsync-api.region.amazonaws.com/graphql
  REACT_APP_REGION=us-east-1
  REACT_APP_USER_POOL_ID=us-east-1_XXXXXX
  REACT_APP_APP_CLIENT_ID=XXXXXXXXXXXX
  REACT_APP_IDENTITY_POOL_ID=us-east-1:xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx
  ```

- **Lex Bot Configuration**:  
  - Use Lex V2
  - IAM Role with permission to call Lambda
  - Lambda should return structured responses Lex can interpret

---

## 🖥️ Usage Examples

### Chatbot Interface

![Chatbot in action](./screenshots/chat-example.png)

- Log in with Cognito.
- Start a conversation with the Lex-powered chatbot.
- Interactions are fulfilled by Lambda and stored/retrieved via DynamoDB.


---

## 🗣️ Lex Intents & Slots

### Intent: `list-s3-buckets`

- **Fulfillment**:
  - Managed by AWS Lambda

---
### Intent: `create-s3-bucket`

- **Slots**:
  - `BucketName` (AMAZON.AlphaNum)

- **Fulfillment**:
  - Managed by AWS Lambda

---
### Intent: `tag-s3-bucket`

- **Slots**:
  - `BucketName` (AMAZON.AlphaNum)
  - `TagKey` (AMAZON.AlphaNum)
  - `TagValue` (AMAZON.AlphaNum)

- **Fulfillment**:
  - Managed by AWS Lambda

---
You can access rest of intents inside AWS Lex.

## 📦 Deployment Instructions

1. **Frontend Deployment** (Amplify Hosting)
   ```bash
   amplify add hosting
   amplify publish
   ```

2. **Lex Bot Deployment**
   - Create and publish Lex bot via AWS Console
   - Associate Lambda function in fulfillment settings

3. **Production Configuration**
   - Enable HTTPS and domain settings in Amplify
   - Monitor logs via CloudWatch
   - Secure IAM roles and access

---

## 📬 Contact & Support

For issues or contributions, please open an issue or pull request on [GitHub](#).
