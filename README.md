# Blog Microservices

A small event-driven blog application built to demonstrate a microservices architecture with Node.js/Express services, an in-memory event bus, and Kubernetes deployment via Skaffold.

## Architecture

Each service keeps its own in-memory data store and stays in sync by emitting and consuming events through a central event bus.

| Service      | Port | Responsibility                                              |
| ------------ | ---- | ------------------------------------------------------------ |
| `client`     | -    | React frontend                                               |
| `posts`      | 4000 | Create/list posts, emits `PostCreated`                       |
| `comments`   | 4001 | Create/list comments on a post, emits `CommentCreated`       |
| `query`      | 4002 | Read-model combining posts + comments, rebuilds from events  |
| `moderation` | 4003 | Approves/rejects comments, emits `CommentModerated`          |
| `event-bus`  | 4005 | Receives events and broadcasts them to all other services    |

### Event flow

1. `posts` emits `PostCreated` when a post is made.
2. `comments` emits `CommentCreated` when a comment is made.
3. `moderation` listens for `CommentCreated`, rejects comments containing the word "orange", and emits `CommentModerated`.
4. `comments` listens for `CommentModerated` and emits `CommentUpdated`.
5. `query` listens for all of the above events and maintains a combined view of posts with their comments.

All events flow through `event-bus`, which fans each event out to `posts`, `comments`, `query`, and `moderation`.

## Tech Stack

- Node.js, Express, Axios
- React (client)
- Docker
- Kubernetes (`infra/k8s`)
- Skaffold for local dev orchestration

## Running Locally

### With Skaffold + Kubernetes

Requires Docker, `kubectl`, and Skaffold with a local Kubernetes cluster (e.g. Docker Desktop or minikube).

```bash
skaffold dev
```

This builds each service's image, deploys the manifests in `infra/k8s`, and syncs source changes into the running containers.

### Running a service individually

```bash
cd <service-directory>   # e.g. posts, comments, query, moderation, event-bus
npm install
npm start
```

Note: services call each other using Kubernetes service DNS names (e.g. `http://event-bus-srv:4005`), so running services outside the cluster requires those hostnames to resolve or the URLs to be adjusted.

## Project Structure

```
client/       React frontend
posts/        Posts service
comments/     Comments service
query/        Aggregated read-model service
moderation/   Comment moderation service
event-bus/    Central event bus
infra/k8s/    Kubernetes manifests
skaffold.yaml Skaffold build/deploy config
```
