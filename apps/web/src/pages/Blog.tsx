import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

export function Blog(): React.ReactNode {
  const posts = useQuery({
    queryKey: ['blog'],
    queryFn: () => apiFetch<BlogPostSummary[]>('/blog'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Guides"
        title="CCTV guides and answers"
        description="Practical advice to help you decide — like how many cameras you need and DVR vs NVR."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(posts.data ?? []).map((post) => (
          <article
            key={post.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <ImageSlot
              src={post.coverImage}
              alt={post.title}
              className="aspect-[16/9] w-full"
            />
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-lg font-semibold text-fg">
                <Link to={`/blog/${post.slug}`} className="hover:text-brand-700">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt ? (
                <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
              ) : null}
              <Link
                to={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
        {(posts.data ?? []).length === 0 ? (
          <p className="text-subtle">No posts published yet.</p>
        ) : null}
      </div>
    </Section>
  );
}

interface BlogPostDetail extends BlogPostSummary {
  body: string;
}

export function BlogPost(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>();

  const post = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => apiFetch<BlogPostDetail | null>(`/blog/${slug}`),
    enabled: Boolean(slug),
  });

  if (post.isLoading) return <Section>Loading…</Section>;
  if (!post.data) return <Section>Post not found.</Section>;

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        <ImageSlot
          src={post.data.coverImage}
          alt={post.data.title}
          className="mb-8 aspect-[16/9] w-full rounded-2xl"
        />
        <h1 className="text-3xl font-semibold text-fg">
          {post.data.title}
        </h1>
        <div className="prose mt-6 max-w-none text-muted">
          <div dangerouslySetInnerHTML={{ __html: post.data.body }} />
        </div>
      </article>
    </Section>
  );
}
