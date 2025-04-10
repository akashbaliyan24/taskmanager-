import { asyncHandler } from "../utils/async-handlers";
import { project, project } from "../models/project.models";
import { User } from "../models/user.models";
const getProjects = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const projects = await project.find({ createdBy: userId });

    if (!projects.length) {
        return res.status(400).json({ message: "no project found" })
    }

    res.status(200).json({
        success: true,
        count: projects.length,
        data: {
            projects,
        },
    });
});


const getProjectById = asyncHandler(async (req, res) => {
    const { userId,projectID } = req.body
    const project = await project.findOne({
        _id : projectID,
        createdBy : userId,
    });
    if(!project){
        return res.status(400).json({message : "project is not found for this user"})
    }
    res.status(200).json({
        success : true,
        data: {
            project:project,
        },
    });
});

const createProject = asyncHandler(async (req, res) => {
    const { name , description } = req.body
    if(!req.user || !req.user._id){
        res.status(400).json({message : "unauthorizedd access "})
    }

    if(!name){
        res.status(400).json({message:"project name is required"});
    }
    const exitingProject = await project.findOne({name , createdBy : req.user._id});

    if(exitingProject){
        res.status(400).json({message : "project with this name already exist"})
    }
    const project = await project.create({
        name , 
        description,
        createdBy : req.user._id,
    });
    res.status(200).json({
        success : true,
        message : "project created successfully",
        data : { 
            project : project,
        },
    })
});

const updateProject = asyncHandler(async (req, res) => {
    const { name , description, createdBy } = req.body
    const project = await project.findById(req.params.id)

    if(!project){
       return res.status(400).json({message : "project not found"});
    }
    if(!req.user || !req.user._id){
      return  res.status(400).json({message : "unauthorized access"})
    }
    if(project.createdBy.toString() !== req.user._id.toString()){
        return res.status(400).json({message : "this project doesn't belongs to you you can't change the project "})
    }
    const updatedProject = await project.update({
        name,
        description,
        createdBy : req.user._id
    });
    res.status(200).json({
        sucess : true,
        message : "Project updated sucessfully",
        data : {
            project : updateProject,
        },
    });
});

const deleteProject = asyncHandler(async (req, res) => {
    const project = await project.findById(req.params.id);

    if(!project){
        res.status(400);
        throw new Error('Project not found');
    }

if(project.createdBy.toString() !== req.user._id.toString()) {
    res.status(400).json({message : 'unauthorized to delete this project'});
}

const deletedProject  = await project.deleteOne();

res.status(200).json({message : "Deleted successfully"});
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const getProjectMemeber = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const updateProjectMember = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});

const deleteMemeber = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body


    // validation 
});


