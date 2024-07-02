export const WebsitePreview = ({ url, width = '1000px', height = '500px' }) => {
    return (
      <div className="website-preview">
        <iframe
          src={url}
          width={width}
          height={height}
          title="Website Preview"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  };