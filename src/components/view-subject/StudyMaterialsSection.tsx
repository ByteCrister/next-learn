import React from "react";
import { SubjectDTO } from "@/types/types.view.subject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, FileText, Download, Calendar } from "lucide-react";
import { getViewStudyMaterials } from "@/utils/api/api.view";
import { toast } from "react-toastify";
import { encodeId } from "@/utils/helpers/IdConversion";
import { ShareStudyMaterialButton } from "@/components/study-materials/ShareStudyMaterialButton";
import { ShareExternalLinkButton } from "@/components/external-links/ShareExternalLinkButton";

type StudyMaterial = {
  _id: string;
  filename: string;
  urls: string[];
  fileTypes: string[];
  tags: string[];
  description?: string;
  uploadedAt: string;
};

type ExternalLink = {
  _id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  addedAt: string;
};

export default function StudyMaterialsSection({ subject }: { subject: SubjectDTO }) {
  const [studyMaterials, setStudyMaterials] = React.useState<StudyMaterial[]>([]);
  const [externalLinks, setExternalLinks] = React.useState<ExternalLink[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStudyMaterials = async () => {
      setLoading(true);
      try {
        const subjectId = subject._id?.toString() || '';
        const result = await getViewStudyMaterials(subjectId);
        if ("message" in result) {
          toast.error(result.message || "Failed to load study materials.");
          setStudyMaterials([]);
          setExternalLinks([]);
        } else {
          setStudyMaterials(result.studyMaterials);
          setExternalLinks(result.externalLinks);
        }
      } catch (error) {
        toast.error("Something went wrong while fetching study materials.");
        setStudyMaterials([]);
        setExternalLinks([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudyMaterials();
  }, [subject._id]);



  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Materials</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading study materials...</p>
        ) : (studyMaterials.length === 0 && externalLinks.length === 0) ? (
          <p>No public study materials or external links available.</p>
        ) : (
          <div className="space-y-4">
            {studyMaterials.map((material) => (
              <div key={material._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium text-gray-900">{material.filename}</h3>
                  </div>
                  {material.description && (
                    <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(material.uploadedAt).toLocaleDateString()}
                    </div>
                    {material.fileTypes.length > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {material.fileTypes[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {material.urls.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(material.urls[0], '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <ShareStudyMaterialButton
                    subjectId={subject._id?.toString() || ''}
                    studyMaterialId={material._id}
                  />
                </div>
              </div>
            ))}
            {externalLinks.map((link) => (
              <div key={link._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium text-gray-900">{link.title}</h3>
                  </div>
                  {link.description && (
                    <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(link.addedAt).toLocaleDateString()}
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {link.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <ShareExternalLinkButton
                    subjectId={subject._id?.toString() || ''}
                    externalLinkId={link._id}
                    title={link.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
