import {
    extractTextFromUploadedFile
} from "../services/ocrExtractor.service.js";

import Curriculum
    from "../models/curriculum.model.js";

import SchemeOfWork
    from "../models/schemeOfWork.model.js";

import {
    structureCurriculumWithAI
} from "../services/aiCurriculumStructurer.service.js";

import {
    generateSchemeOfWork
} from "../services/schemeGenerator.service.js";

import {
    buildCurriculumIdentity,
    buildCurriculumCanonicalKey,
    buildCurriculumAliases
} from "../utils/curriculumIdentity.js";


/*
=========================================================
UPLOAD CURRICULUM
=========================================================
*/

export async function uploadCurriculum(req, res) {

    try {

        const {

            title,

            region,

            country,

            countryCode,

            curriculumBody,

            educationSystem,

            educationSystemCode,

            educationLevel,

            level,

            grade,

            gradeCode,

            subject,

            subjectCode,

            subjectCategory,

            curriculumVersion,

            version,

            year,

            rawText,

            foundational

        } = req.body;


        let extractedText =
            rawText || "";

        let extractionMethod =
            "manual-text";


        /*
        -----------------------------------------------------
        FILE EXTRACTION
        -----------------------------------------------------
        */

        if (req.file) {

            console.log(
                "========== CURRICULUM UPLOAD =========="
            );

            console.log(
                "FILE:",
                req.file.originalname
            );

            console.log(
                "PATH:",
                req.file.path
            );


            const extraction =
                await extractTextFromUploadedFile(

                    req.file.path,

                    req.file.originalname

                );


            extractedText =
                extraction.text || "";


            extractionMethod =
                extraction.method ||
                "unknown";


            console.log(
                "Extraction Method:",
                extractionMethod
            );

            console.log(
                "Characters:",
                extractedText.length
            );

        }


        /*
        -----------------------------------------------------
        GLOBAL IDENTITY
        -----------------------------------------------------
        */

        const identity =
            buildCurriculumIdentity({

                region,

                country,

                countryCode,

                curriculumBody,

                educationSystem,

                educationSystemCode,

                educationLevel:
                    educationLevel || level,

                grade,

                gradeCode,

                subject,

                subjectCode,

                subjectCategory,

                curriculumVersion:
                    curriculumVersion || version || 1

            });


        const canonicalKey =
            buildCurriculumCanonicalKey(identity);


        const aliases =
            buildCurriculumAliases(identity);


        /*
        -----------------------------------------------------
        PREVENT DUPLICATE FOUNDATIONAL CURRICULA
        -----------------------------------------------------
        */

        const existing =
            await Curriculum.findOne({

                canonicalKey

            });


        if (existing) {

            return res.status(409).json({

                success: false,

                code:
                    "CURRICULUM_ALREADY_EXISTS",

                message:
                    "A curriculum with this identity already exists.",

                curriculum:
                    existing

            });

        }


        /*
        -----------------------------------------------------
        CREATE
        -----------------------------------------------------
        */

        const curriculum =
            await Curriculum.create({

                title:
                    title ||
                    `${country || "Global"} ${subject || "Curriculum"} ${grade || ""}`.trim(),

                region:
                    identity.region,

                country:
                    country ||
                    "Kenya",

                countryCode:
                    identity.countryCode,

                curriculumBody:
                    curriculumBody ||
                    "KICD",

                educationSystem:
                    educationSystem || "",

                educationSystemCode:
                    identity.educationSystemCode,

                educationLevel:
                    identity.educationLevel,

                grade:
                    grade,

                gradeCode:
                    identity.gradeCode,

                subject:
                    subject,

                subjectCode:
                    identity.subjectCode,

                subjectCategory:
                    identity.subjectCategory,

                curriculumVersion:
                    identity.curriculumVersion,

                canonicalKey,

                aliases,

                foundational:
                    String(foundational) === "true" ||
                    foundational === true,

                year,

                sourceFileName:
                    req.file?.originalname ||
                    null,

                rawText:
                    extractedText,

                status:
                    "uploaded"

            });


        return res.status(201).json({

            success: true,

            message:
                "Curriculum uploaded successfully.",

            extractionMethod,

            extractedCharacters:
                extractedText.length,

            curriculum

        });


    } catch (error) {

        console.error(
            "\n========== CURRICULUM UPLOAD ERROR ==========\n"
        );

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message,

            stack:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined

        });

    }

}


/*
=========================================================
RESOLVE CURRICULUM
=========================================================
PRIMARY GLOBAL CURRICULUM RESOLUTION CONTRACT
=========================================================
*/

export async function resolveCurriculum(req, res) {

    try {

        const identity =
            buildCurriculumIdentity({

                region:
                    req.query.region,

                country:
                    req.query.country,

                countryCode:
                    req.query.countryCode,

                curriculumBody:
                    req.query.curriculumBody,

                educationSystem:
                    req.query.educationSystem ||
                    req.query.system,

                educationSystemCode:
                    req.query.educationSystemCode,

                educationLevel:
                    req.query.educationLevel ||
                    req.query.level,

                grade:
                    req.query.grade,

                gradeCode:
                    req.query.gradeCode,

                subject:
                    req.query.subject,

                subjectCode:
                    req.query.subjectCode,

                subjectCategory:
                    req.query.subjectCategory,

                curriculumVersion:
                    req.query.curriculumVersion ||
                    req.query.version ||
                    1

            });


        const canonicalKey =
            buildCurriculumCanonicalKey(identity);


        /*
        -----------------------------------------------------
        EXACT CANONICAL MATCH
        -----------------------------------------------------
        */

        let curriculum =
            await Curriculum.findOne({

                canonicalKey

            });


        if (curriculum) {

            return res.json({

                success: true,

                found: true,

                matchType:
                    "exact",

                confidence:
                    1,

                curriculum

            });

        }


        /*
        -----------------------------------------------------
        LEGACY / PARTIAL MATCH
        -----------------------------------------------------
        */

        const query = {};


        if (identity.country) {

            query.country =
                new RegExp(
                    `^${identity.country}$`,
                    "i"
                );

        }


        if (identity.educationSystem) {

            query.educationSystem =
                new RegExp(
                    `^${identity.educationSystem}$`,
                    "i"
                );

        }


        if (identity.educationLevel) {

            query.educationLevel =
                new RegExp(
                    `^${identity.educationLevel}$`,
                    "i"
                );

        }


        if (identity.grade) {

            query.grade =
                new RegExp(
                    `^${identity.grade}$`,
                    "i"
                );

        }


        if (identity.subject) {

            query.subject =
                new RegExp(
                    `^${identity.subject}$`,
                    "i"
                );

        }


        if (Object.keys(query).length) {

            curriculum =
                await Curriculum.findOne(query)
                    .sort({
                        foundational: -1,
                        createdAt: -1
                    });

        }


        if (curriculum) {

            return res.json({

                success: true,

                found: true,

                matchType:
                    "legacy-partial",

                confidence:
                    0.85,

                curriculum

            });

        }


        /*
        -----------------------------------------------------
        NO MATCH
        -----------------------------------------------------
        */

        return res.json({

            success: true,

            found: false,

            matchType:
                "none",

            confidence:
                0,

            curriculum:
                null

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            found: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
LEGACY FIND ENDPOINT
=========================================================
Kept so existing frontend code does not break.
=========================================================
*/

export async function findCurriculum(req, res) {

    return resolveCurriculum(
        req,
        res
    );

}


/*
=========================================================
PARSE CURRICULUM
=========================================================
*/

export async function parseCurriculum(req, res) {

    try {

        const {
            curriculumId
        } = req.params;


        const curriculum =
            await Curriculum.findById(
                curriculumId
            );


        if (!curriculum) {

            return res.status(404).json({

                success: false,

                message:
                    "Curriculum not found"

            });

        }


        curriculum.status =
            "resolving";

        await curriculum.save();


        const structuredCurriculum =
            await structureCurriculumWithAI(

                curriculum.rawText

            );


        curriculum.structuredCurriculum =
            structuredCurriculum;


        curriculum.status =
            "parsed";


        await curriculum.save();


        return res.json({

            success: true,

            message:
                "Curriculum parsed successfully",

            curriculum

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
GENERATE SCHEME
=========================================================
*/

export async function generateScheme(req, res) {

    try {

        const {
            curriculumId
        } = req.params;


        const curriculum =
            await Curriculum.findById(
                curriculumId
            );


        if (!curriculum) {

            return res.status(404).json({

                success: false,

                message:
                    "Curriculum not found"

            });

        }


        if (
            !curriculum
                .structuredCurriculum
                ?.strands
                ?.length
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Curriculum must be parsed before generating scheme."

            });

        }


        const schemeData =
            generateSchemeOfWork(
                curriculum
            );


        const scheme =
            await SchemeOfWork.create({

                curriculumId:
                    curriculum._id,

                ...schemeData

            });


        curriculum.status =
            "scheme_generated";


        await curriculum.save();


        return res.status(201).json({

            success: true,

            scheme

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
GET CURRICULA
=========================================================
*/

export async function getCurricula(req, res) {

    try {

        const curricula =
            await Curriculum.find()
                .sort({
                    foundational: -1,
                    createdAt: -1
                });


        return res.json({

            success: true,

            count:
                curricula.length,

            curricula

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
GET SCHEMES
=========================================================
*/

export async function getSchemes(req, res) {

    try {

        const schemes =
            await SchemeOfWork.find()
                .populate(
                    "curriculumId"
                )
                .sort({
                    createdAt: -1
                });


        return res.json({

            success: true,

            count:
                schemes.length,

            schemes

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
DELETE CURRICULUM
=========================================================
*/

export async function deleteCurriculum(req, res) {

    try {

        await Curriculum.findByIdAndDelete(
            req.params.curriculumId
        );


        return res.json({

            success: true,

            message:
                "Curriculum deleted successfully"

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
DELETE SCHEME
=========================================================
*/

export async function deleteScheme(req, res) {

    try {

        await SchemeOfWork.findByIdAndDelete(
            req.params.schemeId
        );


        return res.json({

            success: true,

            message:
                "Scheme deleted successfully"

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


/*
=========================================================
GET SCHEME BY ID
=========================================================
*/

export async function getSchemeById(req, res) {

    try {

        const scheme =
            await SchemeOfWork.findById(
                req.params.schemeId
            );


        if (!scheme) {

            return res.status(404).json({

                success: false,

                message:
                    "Scheme not found"

            });

        }


        return res.json({

            success: true,

            scheme

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}