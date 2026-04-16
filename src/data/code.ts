// Fake code snippets for file reads and diffs

import type { ProjectType } from '../config.js';

export interface CodeSnippet {
  path: string;
  lines: string[];
  totalLines: number;
}

export interface DiffSnippet {
  path: string;
  hunkHeader: string;
  context: string[];
  removals: string[];
  additions: string[];
  trailingContext: string[];
}

export interface NewFileSnippet {
  path: string;
  lines: string[];
}

// --- File reads ---

const REACT_READS: CodeSnippet[] = [
  {
    path: 'src/utils/auth.ts',
    totalLines: 87,
    lines: [
      "import { ApiClient } from './api';",
      "import { AuthToken, AuthConfig } from '../types';",
      '',
      'const TOKEN_EXPIRY = 3600;',
      'const MAX_RETRIES = 3;',
      '',
      'export async function handleAuth(',
      '  token: string,',
      '  config: AuthConfig',
      '): Promise<AuthToken> {',
      '  let attempts = 0;',
      '  while (attempts < MAX_RETRIES) {',
      '    try {',
      '      return await ApiClient.authenticate(token, config);',
      '    } catch (err) {',
    ],
  },
  {
    path: 'src/components/Button.tsx',
    totalLines: 42,
    lines: [
      "import React from 'react';",
      "import { ButtonProps } from '../types';",
      "import './Button.css';",
      '',
      'export const Button: React.FC<ButtonProps> = ({',
      "  children,",
      "  variant = 'primary',",
      '  disabled = false,',
      '  onClick,',
      '}) => {',
      '  return (',
      '    <button',
      "      className={`btn btn-${variant}`}",
      '      disabled={disabled}',
      '      onClick={onClick}',
      '    >',
    ],
  },
  {
    path: 'src/hooks/useAuth.ts',
    totalLines: 56,
    lines: [
      "import { useState, useEffect, useCallback } from 'react';",
      "import { AuthToken } from '../types';",
      "import { handleAuth } from '../utils/auth';",
      '',
      'export function useAuth() {',
      '  const [token, setToken] = useState<AuthToken | null>(null);',
      '  const [loading, setLoading] = useState(true);',
      '  const [error, setError] = useState<Error | null>(null);',
      '',
      '  const login = useCallback(async (credentials: string) => {',
      '    setLoading(true);',
      '    try {',
      '      const result = await handleAuth(credentials, {',
      '        refreshOnExpiry: true,',
      '      });',
    ],
  },
  {
    path: 'src/services/apiClient.ts',
    totalLines: 94,
    lines: [
      "import { AuthToken } from '../types';",
      '',
      'const BASE_URL = process.env.REACT_APP_API_URL || "/api";',
      '',
      'interface RequestOptions {',
      '  method: string;',
      '  headers?: Record<string, string>;',
      '  body?: unknown;',
      '  signal?: AbortSignal;',
      '}',
      '',
      'export class ApiClient {',
      '  private token: AuthToken | null = null;',
      '',
      '  async request<T>(path: string, options: RequestOptions): Promise<T> {',
    ],
  },
];

const NODE_READS: CodeSnippet[] = [
  {
    path: 'src/middleware/auth.ts',
    totalLines: 63,
    lines: [
      "import { Request, Response, NextFunction } from 'express';",
      "import jwt from 'jsonwebtoken';",
      "import { config } from '../config';",
      '',
      'export function authMiddleware(',
      '  req: Request,',
      '  res: Response,',
      '  next: NextFunction',
      ') {',
      "  const token = req.headers.authorization?.split(' ')[1];",
      '  if (!token) {',
      "    return res.status(401).json({ error: 'Unauthorized' });",
      '  }',
      '  try {',
      '    const decoded = jwt.verify(token, config.jwtSecret);',
    ],
  },
  {
    path: 'src/controllers/userController.ts',
    totalLines: 78,
    lines: [
      "import { Request, Response } from 'express';",
      "import { prisma } from '../config/database';",
      "import { hashPassword, comparePassword } from '../utils/helpers';",
      '',
      'export async function getUsers(req: Request, res: Response) {',
      '  const page = parseInt(req.query.page as string) || 1;',
      '  const limit = parseInt(req.query.limit as string) || 20;',
      '',
      '  const users = await prisma.user.findMany({',
      '    skip: (page - 1) * limit,',
      '    take: limit,',
      "    select: { id: true, email: true, name: true, createdAt: true },",
      '  });',
      '',
      '  const total = await prisma.user.count();',
    ],
  },
];

const PYTHON_READS: CodeSnippet[] = [
  {
    path: 'app/routes/auth.py',
    totalLines: 52,
    lines: [
      'from fastapi import APIRouter, Depends, HTTPException, status',
      'from fastapi.security import OAuth2PasswordRequestForm',
      'from app.services.auth import authenticate_user, create_access_token',
      'from app.models.user import UserCreate, UserResponse',
      'from app.database import get_db',
      '',
      'router = APIRouter(prefix="/auth", tags=["auth"])',
      '',
      '',
      '@router.post("/login")',
      'async def login(form_data: OAuth2PasswordRequestForm = Depends()):',
      '    user = await authenticate_user(form_data.username, form_data.password)',
      '    if not user:',
      '        raise HTTPException(',
      '            status_code=status.HTTP_401_UNAUTHORIZED,',
    ],
  },
];

const RUST_READS: CodeSnippet[] = [
  {
    path: 'src/handlers/auth.rs',
    totalLines: 89,
    lines: [
      'use actix_web::{web, HttpResponse, HttpRequest};',
      'use serde::{Deserialize, Serialize};',
      'use crate::db::Pool;',
      'use crate::error::AppError;',
      'use crate::models::user::User;',
      '',
      '#[derive(Deserialize)]',
      'pub struct LoginRequest {',
      '    pub email: String,',
      '    pub password: String,',
      '}',
      '',
      '#[derive(Serialize)]',
      'pub struct AuthResponse {',
      '    pub token: String,',
    ],
  },
];

const GO_READS: CodeSnippet[] = [
  {
    path: 'internal/handlers/auth.go',
    totalLines: 75,
    lines: [
      'package handlers',
      '',
      'import (',
      '\t"encoding/json"',
      '\t"net/http"',
      '\t"time"',
      '',
      '\t"github.com/golang-jwt/jwt/v5"',
      '\t"myapp/internal/models"',
      '\t"myapp/internal/services"',
      ')',
      '',
      'type AuthHandler struct {',
      '\tauthService *services.AuthService',
      '}',
    ],
  },
];

const READS_MAP: Record<ProjectType, CodeSnippet[]> = {
  react: REACT_READS,
  node: NODE_READS,
  python: PYTHON_READS,
  rust: RUST_READS,
  go: GO_READS,
};

export function getReadSnippets(type: ProjectType): readonly CodeSnippet[] {
  return READS_MAP[type];
}

// --- Diffs ---

const REACT_DIFFS: DiffSnippet[] = [
  {
    path: 'src/utils/auth.ts',
    hunkHeader: '@@ -4,7 +4,9 @@',
    context: ['const TOKEN_EXPIRY = 3600;'],
    removals: ['const MAX_RETRIES = 3;'],
    additions: ['const MAX_RETRIES = 5;', 'const RETRY_DELAY = 1000;'],
    trailingContext: ['', 'export async function handleAuth('],
  },
  {
    path: 'src/utils/auth.ts',
    hunkHeader: '@@ -11,6 +13,7 @@',
    context: ['  let attempts = 0;'],
    removals: ['  while (attempts < MAX_RETRIES) {'],
    additions: ['  while (attempts <= MAX_RETRIES) {'],
    trailingContext: ['    try {', '      return await ApiClient.authenticate(token, config);', '    } catch (err) {'],
  },
  {
    path: 'src/components/Button.tsx',
    hunkHeader: '@@ -8,6 +8,7 @@',
    context: ['  disabled = false,', '  onClick,'],
    removals: ['}) => {'],
    additions: ["  loading = false,", '}) => {'],
    trailingContext: ['  return ('],
  },
  {
    path: 'src/hooks/useAuth.ts',
    hunkHeader: '@@ -10,7 +10,10 @@',
    context: ['  const login = useCallback(async (credentials: string) => {'],
    removals: ['    setLoading(true);'],
    additions: ['    setLoading(true);', '    setError(null);'],
    trailingContext: ['    try {'],
  },
  {
    path: 'src/services/apiClient.ts',
    hunkHeader: '@@ -15,6 +15,9 @@',
    context: ['  async request<T>(path: string, options: RequestOptions): Promise<T> {'],
    removals: ['    const url = `${BASE_URL}${path}`;'],
    additions: [
      '    const url = `${BASE_URL}${path}`;',
      '    const controller = new AbortController();',
      '    const timeout = setTimeout(() => controller.abort(), 30000);',
    ],
    trailingContext: ['    try {'],
  },
];

const NODE_DIFFS: DiffSnippet[] = [
  {
    path: 'src/middleware/auth.ts',
    hunkHeader: '@@ -10,7 +10,8 @@',
    context: ["  const token = req.headers.authorization?.split(' ')[1];"],
    removals: ['  if (!token) {'],
    additions: ['  if (!token || token === "undefined") {', '    console.warn(`Auth: missing token from ${req.ip}`);'],
    trailingContext: ["    return res.status(401).json({ error: 'Unauthorized' });"],
  },
];

const PYTHON_DIFFS: DiffSnippet[] = [
  {
    path: 'app/routes/auth.py',
    hunkHeader: '@@ -11,6 +11,8 @@',
    context: ['async def login(form_data: OAuth2PasswordRequestForm = Depends()):'],
    removals: ['    user = await authenticate_user(form_data.username, form_data.password)'],
    additions: [
      '    user = await authenticate_user(form_data.username, form_data.password)',
      '    logger.info(f"Login attempt for {form_data.username}")',
    ],
    trailingContext: ['    if not user:'],
  },
];

const RUST_DIFFS: DiffSnippet[] = [
  {
    path: 'src/handlers/auth.rs',
    hunkHeader: '@@ -14,6 +14,7 @@',
    context: ['pub struct AuthResponse {'],
    removals: ['    pub token: String,'],
    additions: ['    pub token: String,', '    pub expires_at: i64,'],
    trailingContext: ['}'],
  },
];

const GO_DIFFS: DiffSnippet[] = [
  {
    path: 'internal/handlers/auth.go',
    hunkHeader: '@@ -13,6 +13,7 @@',
    context: ['type AuthHandler struct {'],
    removals: ['\tauthService *services.AuthService'],
    additions: ['\tauthService *services.AuthService', '\tlogger     *slog.Logger'],
    trailingContext: ['}'],
  },
];

const DIFFS_MAP: Record<ProjectType, DiffSnippet[]> = {
  react: REACT_DIFFS,
  node: NODE_DIFFS,
  python: PYTHON_DIFFS,
  rust: RUST_DIFFS,
  go: GO_DIFFS,
};

export function getDiffSnippets(type: ProjectType): readonly DiffSnippet[] {
  return DIFFS_MAP[type];
}

// --- New file writes ---

const REACT_NEW_FILES: NewFileSnippet[] = [
  {
    path: 'src/components/SearchBar.tsx',
    lines: [
      "import React, { useState, useCallback } from 'react';",
      "import { useDebounce } from '../hooks/useDebounce';",
      '',
      'interface SearchBarProps {',
      '  placeholder?: string;',
      '  onSearch: (query: string) => void;',
      '  debounceMs?: number;',
      '}',
      '',
      'export const SearchBar: React.FC<SearchBarProps> = ({',
      "  placeholder = 'Search...',",
      '  onSearch,',
      '  debounceMs = 300,',
      '}) => {',
      "  const [query, setQuery] = useState('');",
      '  const debouncedSearch = useDebounce(onSearch, debounceMs);',
      '',
      '  const handleChange = useCallback(',
      '    (e: React.ChangeEvent<HTMLInputElement>) => {',
      '      setQuery(e.target.value);',
      '      debouncedSearch(e.target.value);',
      '    },',
      '    [debouncedSearch]',
      '  );',
      '',
      '  return (',
      '    <div className="search-bar">',
      '      <input',
      '        type="text"',
      '        value={query}',
      '        onChange={handleChange}',
      '        placeholder={placeholder}',
      '      />',
      '    </div>',
      '  );',
      '};',
    ],
  },
  {
    path: 'src/hooks/useDebounce.ts',
    lines: [
      "import { useRef, useCallback } from 'react';",
      '',
      'export function useDebounce<T extends (...args: unknown[]) => void>(',
      '  callback: T,',
      '  delay: number',
      '): T {',
      '  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();',
      '',
      '  return useCallback(',
      '    ((...args: unknown[]) => {',
      '      if (timeoutRef.current) clearTimeout(timeoutRef.current);',
      '      timeoutRef.current = setTimeout(() => callback(...args), delay);',
      '    }) as T,',
      '    [callback, delay]',
      '  );',
      '}',
    ],
  },
];

const NODE_NEW_FILES: NewFileSnippet[] = [
  {
    path: 'src/middleware/rateLimit.ts',
    lines: [
      "import { Request, Response, NextFunction } from 'express';",
      '',
      'const requestCounts = new Map<string, { count: number; resetAt: number }>();',
      '',
      'export function rateLimit(maxRequests = 100, windowMs = 60000) {',
      '  return (req: Request, res: Response, next: NextFunction) => {',
      "    const key = req.ip || 'unknown';",
      '    const now = Date.now();',
      '    const record = requestCounts.get(key);',
      '',
      '    if (!record || now > record.resetAt) {',
      '      requestCounts.set(key, { count: 1, resetAt: now + windowMs });',
      '      return next();',
      '    }',
      '',
      '    if (record.count >= maxRequests) {',
      "      return res.status(429).json({ error: 'Too many requests' });",
      '    }',
      '',
      '    record.count++;',
      '    next();',
      '  };',
      '}',
    ],
  },
];

const PYTHON_NEW_FILES: NewFileSnippet[] = [
  {
    path: 'app/utils/rate_limiter.py',
    lines: [
      'from functools import wraps',
      'from time import time',
      'from collections import defaultdict',
      'from fastapi import HTTPException, status',
      '',
      '',
      'class RateLimiter:',
      '    def __init__(self, max_requests: int = 100, window: int = 60):',
      '        self.max_requests = max_requests',
      '        self.window = window',
      '        self._requests: dict[str, list[float]] = defaultdict(list)',
      '',
      '    def check(self, key: str) -> bool:',
      '        now = time()',
      '        self._requests[key] = [',
      '            t for t in self._requests[key] if now - t < self.window',
      '        ]',
      '        if len(self._requests[key]) >= self.max_requests:',
      '            return False',
      '        self._requests[key].append(now)',
      '        return True',
    ],
  },
];

const RUST_NEW_FILES: NewFileSnippet[] = [
  {
    path: 'src/middleware/rate_limit.rs',
    lines: [
      'use std::collections::HashMap;',
      'use std::sync::Mutex;',
      'use std::time::{Duration, Instant};',
      'use actix_web::dev::{ServiceRequest, ServiceResponse};',
      '',
      'pub struct RateLimiter {',
      '    max_requests: usize,',
      '    window: Duration,',
      '    requests: Mutex<HashMap<String, Vec<Instant>>>,',
      '}',
      '',
      'impl RateLimiter {',
      '    pub fn new(max_requests: usize, window_secs: u64) -> Self {',
      '        Self {',
      '            max_requests,',
      '            window: Duration::from_secs(window_secs),',
      '            requests: Mutex::new(HashMap::new()),',
      '        }',
      '    }',
      '}',
    ],
  },
];

const GO_NEW_FILES: NewFileSnippet[] = [
  {
    path: 'internal/middleware/ratelimit.go',
    lines: [
      'package middleware',
      '',
      'import (',
      '\t"net/http"',
      '\t"sync"',
      '\t"time"',
      ')',
      '',
      'type RateLimiter struct {',
      '\tmu          sync.Mutex',
      '\trequests    map[string][]time.Time',
      '\tmaxRequests int',
      '\twindow      time.Duration',
      '}',
      '',
      'func NewRateLimiter(max int, window time.Duration) *RateLimiter {',
      '\treturn &RateLimiter{',
      '\t\trequests:    make(map[string][]time.Time),',
      '\t\tmaxRequests: max,',
      '\t\twindow:      window,',
      '\t}',
      '}',
    ],
  },
];

const NEW_FILES_MAP: Record<ProjectType, NewFileSnippet[]> = {
  react: REACT_NEW_FILES,
  node: NODE_NEW_FILES,
  python: PYTHON_NEW_FILES,
  rust: RUST_NEW_FILES,
  go: GO_NEW_FILES,
};

export function getNewFileSnippets(type: ProjectType): readonly NewFileSnippet[] {
  return NEW_FILES_MAP[type];
}
