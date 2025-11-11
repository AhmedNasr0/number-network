import { useState } from 'react';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('auth');
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string, id: string }) => (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <pre style={{
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: '15px',
        borderRadius: '8px',
        overflow: 'auto',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '6px 12px',
          background: copiedCode === id ? '#4CAF50' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {copiedCode === id ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  );

  const Badge = ({ type }: { type: string }) => {
    const colors = {
      get: '#61AFFE',
      post: '#49CC90',
      auth: '#F93E3E',
      public: '#50E3C2'
    };
    return (
      <span style={{
        background: colors[type as keyof typeof colors] || '#999',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginRight: '10px'
      }}>
        {type.toUpperCase()}
      </span>
    );
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {title && <h2 style={{ marginTop: 0, color: '#333' }}>{title}</h2>}
      {children}
    </div>
  );

  const EndpointCard = ({ method, path, auth, description, children }: { method: string, path: string, auth: boolean, description: string, children: React.ReactNode }) => (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      background: '#fafafa'
    }}>
      <div style={{ marginBottom: '15px' }}>
        <Badge type={method as string} />
        <code style={{ 
          background: '#f5f5f5', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {path}
        </code>
        {auth && <Badge type="auth" />}
        {!auth && <Badge type="public" />}
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>{description}</p>
      {children}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>
            📚 Number Discussion Network API
          </h1>
          <p style={{ color: '#666', marginTop: '10px', marginBottom: 0 }}>
            Complete API documentation for authentication, posts, and comments endpoints
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'auth', label: '🔐 Authentication' },
            { id: 'posts', label: '📝 Posts' },
            { id: 'comments', label: '💬 Comments' },
            { id: 'examples', label: '🎯 Examples' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeSection === tab.id ? '#667eea' : '#f5f5f5',
                color: activeSection === tab.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Base URL Info */}
        <Section title="🌐 Base URL">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <code style={{
              background: '#1e1e1e',
              color: '#4CAF50',
              padding: '10px 15px',
              borderRadius: '6px',
              flex: 1,
              minWidth: '250px'
            }}>
              Local: http://localhost:3001/api
            </code>
            <code style={{
              background: '#1e1e1e',
              color: '#2196F3',
              padding: '10px 15px',
              borderRadius: '6px',
              flex: 1,
              minWidth: '250px'
            }}>
              Production: http://209.38.17.142/
            </code>
          </div>
        </Section>

        {/* Authentication Section */}
        {activeSection === 'auth' && (
          <>
            <Section title="🔐 Authentication Endpoints Note">
              <p style={{ color: '#666' }}>
                All authenticated endpoints require a Bearer token in the Authorization header
              </p>
            </Section>

            <Section title="🔐 Authentication Endpoints">
              <EndpointCard
                method="post"
                path="/api/auth/register"
                description="Create a new user account"
                auth={false}
              >
                <h4>📥 Request Body</h4>
                <CodeBlock id="register-req" code={`{
  "username": "john_doe",    // Required, min 3 characters
  "password": "password123"  // Required, min 6 characters
}`} />

                <h4>✅ Success Response (201)</h4>
                <CodeBlock id="register-res" code={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe"
  }
}`} />

                <h4>❌ Error Responses</h4>
                <CodeBlock id="register-err" code={`// 400 Bad Request
{
  "error": "Username must be at least 3 characters"
  // OR "Password must be at least 6 characters"
  // OR "Username already exists"
}

// 500 Internal Server Error
{
  "error": "Registration failed"
}`} />

                <h4>💻 Example Usage</h4>
                <CodeBlock id="register-example" code={`const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);`} />
              </EndpointCard>

              <EndpointCard
                method="post"
                path="/api/auth/login"
                description="Authenticate an existing user"
                auth={false}
              >
                <h4>📥 Request Body</h4>
                <CodeBlock id="login-req" code={`{
  "username": "john_doe",
  "password": "password123"
}`} />

                <h4>✅ Success Response (200)</h4>
                <CodeBlock id="login-res" code={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe"
  }
}`} />

                <h4>❌ Error Responses</h4>
                <CodeBlock id="login-err" code={`// 401 Unauthorized
{
  "error": "Invalid credentials"
}

// 500 Internal Server Error
{
  "error": "Login failed"
}`} />
              </EndpointCard>
            </Section>
          </>
        )}

        {/* Posts Section */}
        {activeSection === 'posts' && (
          <>
            <Section title="📝 Posts Endpoints Note">
              <p style={{ color: '#666' }}>
                Manage starting numbers and retrieve posts with nested comment trees
              </p>
            </Section>

            <Section title="📝 Posts Endpoints">
              <EndpointCard
                method="get"
                path="/api/posts"
                description="Retrieve all posts with their nested comments tree"
                auth={false}
              >
                <h4>✅ Success Response (200)</h4>
                <CodeBlock id="getposts-res" code={`[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "username": "john_doe",
    "number": 10,
    "created_at": "2024-03-02T10:30:00.000Z",
    "comments": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "username": "jane_smith",
        "operator": "+",
        "right_operand": 5,
        "result": 15,
        "created_at": "2024-03-02T10:35:00.000Z",
        "children": [
          {
            "id": "880e8400-e29b-41d4-a716-446655440004",
            "username": "john_doe",
            "operator": "*",
            "right_operand": 2,
            "result": 30,
            "children": []
          }
        ]
      }
    ]
  }
    ]`} />

                <div style={{
                  background: '#f0f7ff',
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#0066cc' }}>🌳 Visual Tree Structure</h4>
                  <pre style={{ 
                    background: 'white', 
                    padding: '15px', 
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
{`Post: 10 (by john_doe)
├─ Comment 1: + 5 = 15 (by jane_smith)
│  └─ Comment 1.1: × 2 = 30 (by john_doe)
└─ Comment 2: - 3 = 7 (by jane_smith)`}
                  </pre>
                </div>

                <h4>💻 Example Usage</h4>
                <CodeBlock id="getposts-example" code={`const response = await fetch('http://localhost:3001/api/posts');
const posts = await response.json();

console.log(posts[0].number); // 10
console.log(posts[0].comments[0].result); // 15`} />
              </EndpointCard>

              <EndpointCard
                method="post"
                path="/api/posts"
                auth={true}
                description="Create a new post with a starting number"
              >
                <h4>🔑 Required Headers</h4>
                <CodeBlock id="post-headers" code={`Authorization: Bearer <your-jwt-token>
Content-Type: application/json`} />

                <h4>📥 Request Body</h4>
                <CodeBlock id="createpost-req" code={`{
  "number": 42  // Can be integer, float, negative, or zero
}`} />

                <h4>✅ Success Response (201)</h4>
                <CodeBlock id="createpost-res" code={`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "username": "john_doe",
  "number": 42,
  "created_at": "2024-03-02T10:30:00.000Z",
  "comments": []
}`} />

                <h4>💻 Example Usage</h4>
                <CodeBlock id="createpost-example" code={`const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({ number: 42 })
});

const newPost = await response.json();`} />
              </EndpointCard>
            </Section>
          </>
        )}

        {/* Comments Section */}
        {activeSection === 'comments' && (
          <>
            <Section title="💬 Comments Endpoint Note">
              <p style={{ color: '#666' }}>
                Add mathematical operations to posts or reply to existing operations
              </p>
            </Section>

            <Section title="💬 Comments Endpoints">
              <EndpointCard
                method="post"
                path="/api/comments"
                auth={true}
                description="Add an operation to a post or reply to another operation"
              >
                <h4>🔑 Required Headers</h4>
                <CodeBlock id="comment-headers" code={`Authorization: Bearer <your-jwt-token>
Content-Type: application/json`} />

                <h4>📥 Request Body (Comment on Post)</h4>
                <CodeBlock id="comment-post-req" code={`{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "parentCommentId": null,  // null for top-level
  "operator": "+",          // "+", "-", "*", "/"
  "rightOperand": 5
}`} />

                <h4>📥 Request Body (Reply to Comment)</h4>
                <CodeBlock id="comment-reply-req" code={`{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "parentCommentId": "770e8400-e29b-41d4-a716-446655440002",
  "operator": "*",
  "rightOperand": 2
}`} />

                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#856404' }}>🧮 How Calculation Works</h4>
                  <p style={{ marginBottom: '10px', color: '#856404' }}>
                    <strong>Comment on Post:</strong> leftOperand = post.number
                  </p>
                  <pre style={{ 
                    background: 'white', 
                    padding: '10px', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#333'
                  }}>
{`Post: 10
Operation: + 5
Result: 10 + 5 = 15`}
                  </pre>
                  
                  <p style={{ marginBottom: '10px', marginTop: '15px', color: '#856404' }}>
                    <strong>Reply to Comment:</strong> leftOperand = parentComment.result
                  </p>
                  <pre style={{ 
                    background: 'white', 
                    padding: '10px', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#333'
                  }}>
{`Parent Result: 15
Operation: × 2
Result: 15 × 2 = 30`}
                  </pre>
                </div>

                <h4>✅ Success Response (201)</h4>
                <CodeBlock id="comment-res" code={`{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "660e8400-e29b-41d4-a716-446655440003",
  "post_id": "550e8400-e29b-41d4-a716-446655440000",
  "parent_comment_id": null,
  "username": "jane_smith",
  "operator": "+",
  "right_operand": 5,
  "result": 15,
  "created_at": "2024-03-02T10:35:00.000Z",
  "children": []
}`} />

                <h4>❌ Error Responses</h4>
                <CodeBlock id="comment-err" code={`// 400 Bad Request
{
  "error": "Post ID is required"
  // OR "Invalid operator"
  // OR "Right operand must be a valid number"
  // OR "Cannot divide by zero"
}

// 404 Not Found
{
  "error": "Parent comment not found"
  // OR "Post not found"
}`} />

                <h4>💻 Example Usage</h4>
                <CodeBlock id="comment-example" code={`const token = localStorage.getItem('token');

// Add operation to post
const response = await fetch('http://localhost:3001/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    postId: '550e8400-e29b-41d4-a716-446655440000',
    parentCommentId: null,
    operator: '+',
    rightOperand: 5
  })
});

const comment = await response.json();
console.log(comment.result); // 15`} />
              </EndpointCard>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '20px'
              }}>
                <h3 style={{ marginTop: 0 }}>📊 Valid Operators</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {[
                    { op: '+', name: 'Addition', example: '10 + 5 = 15' },
                    { op: '-', name: 'Subtraction', example: '10 - 3 = 7' },
                    { op: '*', name: 'Multiplication', example: '10 × 2 = 20' },
                    { op: '/', name: 'Division', example: '10 ÷ 2 = 5' }
                  ].map(({ op, name, example }) => (
                    <div key={op} style={{
                      background: '#f5f5f5',
                      padding: '15px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{op}</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{name}</div>
                      <code style={{ fontSize: '12px', color: '#666' }}>{example}</code>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {/* Examples Section */}
        {activeSection === 'examples' && (
          <>
            <Section title="🎯 Complete Usage Examples">
              <p style={{ color: '#666' }}>
                Real-world examples showing how to use the API
              </p>
            </Section>

            <Section title="🎯 Complete Usage Examples">
              <h3>Example 1: Register, Login & Create Post</h3>
              <CodeBlock id="example-1" code={`// 1. Register a new user
const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'alice',
    password: 'alice123'
  })
});

const { token } = await registerResponse.json();
localStorage.setItem('token', token);

// 2. Create a post
const postResponse = await fetch('http://localhost:3001/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({ number: 100 })
});

const post = await postResponse.json();
console.log('Created post:', post.id);`} />
            </Section>

            <Section title="🎯 Complete Usage Examples">
              <h3>Example 2: Create Nested Operations</h3>
              <CodeBlock id="example-2" code={`const token = localStorage.getItem('token');
const postId = 'your-post-id';

// 1. First operation: 100 + 50 = 150
const comment1 = await fetch('http://localhost:3001/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    postId,
    parentCommentId: null,
    operator: '+',
    rightOperand: 50
  })
}).then(r => r.json());

console.log('Result 1:', comment1.result); // 150

// 2. Reply to first: 150 × 2 = 300
const comment2 = await fetch('http://localhost:3001/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    postId,
    parentCommentId: comment1.id,
    operator: '*',
    rightOperand: 2
  })
}).then(r => r.json());

console.log('Result 2:', comment2.result); // 300

// 3. Reply to second: 300 - 100 = 200
const comment3 = await fetch('http://localhost:3001/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    postId,
    parentCommentId: comment2.id,
    operator: '-',
    rightOperand: 100
  })
}).then(r => r.json());

console.log('Final result:', comment3.result); // 200`} />
            </Section>

            <Section title="🎯 Complete Usage Examples">
              <h3>Example 3: Fetch & Display Posts</h3>
              <CodeBlock id="example-3" code={`// Fetch all posts
const response = await fetch('http://localhost:3001/api/posts');
const posts = await response.json();

// Recursive function to render comments
function renderComments(comments, depth = 0) {
  comments.forEach(comment => {
    const indent = '  '.repeat(depth);
    console.log(\`\${indent}├─ \${comment.operator} \${comment.right_operand} = \${comment.result} by \${comment.username}\`);
    
    if (comment.children.length > 0) {
      renderComments(comment.children, depth + 1);
    }
  });
}

// Display all posts
posts.forEach(post => {
  console.log(\`\\nPost: \${post.number} by \${post.username}\`);
  renderComments(post.comments);
});

// Output:
// Post: 100 by alice
//   ├─ + 50 = 150 by bob
//   │  └─ × 2 = 300 by alice
//   │     └─ - 100 = 200 by charlie`} />
            </Section>

            <Section title="🎯 Complete Usage Examples">
              <h3>Example 4: Error Handling</h3>
              <CodeBlock id="example-4" code={`async function createPost(number) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }
    
    const response = await fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${token}\`
      },
      body: JSON.stringify({ number })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please login again.');
      } else if (response.status === 400) {
        throw new Error(data.error);
      } else {
        throw new Error('Failed to create post');
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
try {
  const newPost = await createPost(42);
  console.log('Success:', newPost);
} catch (error) {
  alert('Error: ' + error.message);
}`} />
            </Section>
          </>
        )}

      </div>
    </div>
  );
};

export default DocsPage;